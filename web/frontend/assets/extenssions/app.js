
var oscpCartTemplate = {
	settings: {},
	init: function(){
		var $this = this;
		if(typeof oscpCPWAppConfig == 'undefined'){
			eval(jQuery(document).find('script[type="text/oscpAppSetting"]').eq(0).text());
		}
		$this.settings = (typeof oscpCPWAppConfig == 'undefined') ? {} : oscpCPWAppConfig;
        $this.settings.cartRule = JSON.parse($this.settings.cartRule);
        $this.settings.priceGrid = JSON.parse($this.settings.priceGrid);

		//jQuery('form[action*="/cart"]').unbind('submit');

		/*jQuery(document).on('submit', 'form[action*="/cart"]', function(e){ //Handle shoping cart form submit event. and in cart item have price rule then create draft order
			e.preventDefault()
			e.stopPropagation()
			return false;
		})*/

		jQuery(document).on('click', $this.settings.eleCheckoutBtn, function(e){
			if(!$this.isApplicableRules()){
				return true;
			}else{
				e.preventDefault();
				e.stopPropagation();

				if(typeof draftTimer !== 'undefined'){
					clearTimeout(draftTimer);
				}

				draftTimer = setTimeout(function(){
					$this.orderDraft();
				}, 100);

				return false;
			}
		})

		jQuery(document).on('change', $this.settings.eleQtyInput, function(e){ //On cart quantity change. fetch updated cart data
			jQuery('body').removeClass('CPW-priceLoaded')
			setTimeout(function(){
				var cartContents = fetch(window.Shopify.routes.root + 'cart.js').then(response => response.json()).then(data => { $this.settings.cart = data; $this.cartInit();});
			}, 1500);
		});

		jQuery(document).on('click', $this.settings.eleCartRemoveButton, function(e){
			 //On cart item remove. fetch updated cart	data
			setTimeout(function(){
				var cartContents = fetch(window.Shopify.routes.root + 'cart.js').then(response => response.json()).then(data => { $this.settings.cart = data; $this.cartInit();});
			}, 1000);
		});

		jQuery(document).on('click', 'cart-remove-button', function(e){
			setTimeout(function(){
				var cartContents = fetch(window.Shopify.routes.root + 'cart.js').then(response => response.json()).then(data => { $this.settings.cart = data; $this.cartInit();});
			}, 1000);
		});

		jQuery(document).on('click', $this.settings.eleProductAddToCart, function(e){ //On cart item remove. fetch updated cart	data
			setTimeout(function(){
				var cartContents = fetch(window.Shopify.routes.root + 'cart.js').then(response => response.json()).then(data => {
					$this.settings.cartRule[$this.settings.product.id] = $this.settings.priceGrid;
					$this.settings.cart = data;
					$this.cartInit();
				});
			}, 1000);
		});

		document.addEventListener('cpw:cart-init', function(evt) {
			var cartContents = fetch(window.Shopify.routes.root + 'cart.js').then(response => response.json()).then(data => {
				if($this.settings.cartRule == null){
					$this.settings.cartRule = [];
				}
				if($this.settings.product !== null){
					$this.settings.cartRule[$this.settings.product.id] = $this.settings.priceGrid;
				}
				$this.settings.cart = data;
				$this.cartInit();
			});
		})

		this.cartInit();

		document.dispatchEvent(new CustomEvent('cpw:init'));

	},
	isApplicableRules: function(){ //Check if cart items have any applicable price rule
		var validate = false;
		for(i=0; i<this.settings.cart.items.length; i++){
			if(this.settings.cart.items[i].hasOwnProperty('applicable_rule')){
				validate = true;
			}
		}
		return validate;
	},
	orderDraft: function(){ 	//Create and fetch draft order from server before checkout
		var $this = this;
		$.ajax({
			type: "POST",
			data: JSON.stringify(this.settings.cart),
			contentType: 'application/json',
			url: '/apps/tier/appfront/draft?shop='+Shopify.shop+'&s=os'+this.settings.secret+'cp',
			success: function(result){
				if(result.draft_order.invoice_url == ''){
					window.location.href = '/checkout';
				}else{
					window.location.href = result.draft_order.invoice_url;
				}
				
			},
			complete: function(xhr, status){
				//if not success then submit the form
			}
		}).fail(function(){
			window.location.href = '/checkout';
		});
	},
	cartInit: function(){	// Start price rule bootstrapping for product page
		var productsId = [];
		for(i=0; i<this.settings.cart.items.length; i++){
			productsId.push(this.settings.cart.items[i].product_id);
		}

		productsId = productsId.filter((c, index) => { //Merge duplicate ids
			return productsId.indexOf(c) === index;
		});

		$('body').addClass('CPW-priceLoaded')
		this.initializeCartValue();

		//this.getProductsRule(productsId.join(','));
	},
	initializeCartValue: function(){ // Update cart object is cart item have applicable price rule
		var productRules = this.settings.cartRule;
		for(i=0; i<this.settings.cart.items.length; i++){
			if(productRules.hasOwnProperty(this.settings.cart.items[i].product_id)){
				var applicableRule = this.getApplicableRule(this.settings.cart.items[i]);
				if(!applicableRule.length){
					delete this.settings.cart.items[i].price_rule;
					delete this.settings.cart.items[i].applicable_rule;
				}else if(applicableRule[0] < this.settings.cart.items[i].price){
					this.settings.cart.items[i].price_rule = applicableRule[3];
					this.settings.cart.items[i].applicable_rule = applicableRule;
				}else{
					delete this.settings.cart.items[i].price_rule;
					delete this.settings.cart.items[i].applicable_rule;
				}
			}
		}
		this.setCartTemplate();
	},
	getApplicableRule: function(cart){ // Check if cart line item have any applicable price rule
		var line = '';
		var lines = '';
		var cartRule = this.settings.cartRule;
		if(cartRule[cart.product_id] !== null){
			for(var i=0; i<cartRule[cart.product_id].length; i++){
				if(cartRule[cart.product_id][i].hasOwnProperty('id')){ //Handle variant template
					if(cartRule[cart.product_id][i].id == cart.variant_id){
						for(var j=0; j<cartRule[cart.product_id][i]['rules'].length; j++){
							if( parseInt(cart.quantity) >= parseInt(cartRule[cart.product_id][i]['rules'][j]['qty']) ){
								var line = cartRule[cart.product_id][i]['rules'][j];
								var lines = cartRule[cart.product_id][i]['rules'];
								lines.sort(function(a, b) {
									return parseInt(a.qty) - parseInt(b.qty);
								});
							}
						}
					}
				}else{ //Handle offer list template
					for(var j=0; j<cartRule[cart.product_id].length; j++){
						if( parseInt(cart.quantity) >= parseInt(cartRule[cart.product_id][j]['qty']) ){
							var line = cartRule[cart.product_id][j];
							var lines = cartRule[cart.product_id];
						}

					}
				}

			}
		}

		if(line == ''){
			return [];
		}
		var price = this.getLineItemPrice(cart.price, line, lines, cart.quantity);

		return price;
	},
	setCartTemplate: function(){	// Change product price on cart page. if product have applicable rule
		var cartTotal = 0;
		for(i=0; i<this.settings.cart.items.length; i++){
			if(this.settings.cart.items[i].hasOwnProperty('applicable_rule')){
				//console.log('applicable_rule ==== ',this.setMoneyFormat(this.settings.cart.items[i].applicable_rule));
				// console.log('applicable_rule ==== ',this.settings.cart.items[i].applicable_rule);
				$(this.settings.eleCartContainer).eq(i).find(this.settings.eleLineItemTotal).html(this.setMoneyFormat(this.settings.cart.items[i].applicable_rule[1]));
				$(this.settings.eleCartContainer).eq(i).find(this.settings.eleLineItemPrice).eq(0).html('<s>'+this.setMoneyFormat(this.settings.cart.items[i].original_price)+'</s>  '+this.setMoneyFormat(this.settings.cart.items[i].applicable_rule[0]))
				
				//$('.cpw-quick-cart-items').eq(i).find(this.settings.eleLineItemTotal).html(this.setMoneyFormat(this.settings.cart.items[i].applicable_rule[1]));
				//$('.cpw-quick-cart-items').eq(i).find('.cpw-quick-line-item-price').eq(0).html('<s>'+this.setMoneyFormat(this.settings.cart.items[i].original_price)+'</s>  '+this.setMoneyFormat(this.settings.cart.items[i].applicable_rule[0]))				
								
				// if(this.settings.product !== null){
				// 	if(this.settings.cart.items[i].product_id == this.settings.product.id ){
				// 		$('.purchase-confirmation-popup__product-title-price').html('<s>'+this.setMoneyFormat(this.settings.cart.items[i].original_price)+'</s>  '+this.setMoneyFormat(this.settings.cart.items[i].applicable_rule[0]))
				// 	}
				// }				

				cartTotal = cartTotal+parseInt(this.settings.cart.items[i].applicable_rule[1]);
			}else{
				cartTotal = cartTotal+parseInt(this.settings.cart.items[i].line_price);
			}

			
		}

		$(this.settings.eleCartItemTotal).html(this.setMoneyFormat(cartTotal));
		//$('.cpw-quick-cart-total').html(this.setMoneyFormat(cartTotal));

	},
	getLineItemPrice: function(price, rule, rules, qty){ // Return calculated (line item price, line item total price and saving amount)
		price = parseInt(price);

		rule.type = (rule.type == 'discount') ? 'percent' : rule.type;

		var rowValue = (rule.type == 'percent') ? parseFloat(rule.value) : parseFloat(rule.value)*100;
		if(rule.type == 'percent'){
			var calulatedPrice = (price-(price*rowValue/100));
			var save =  rowValue.toFixed(2)+'%'
		}else{
			var calulatedPrice = rowValue;
			var save =  (100*(price - rowValue)/price);
			save = save.toFixed(2);
			save = save+'%';
		}
		var calulatedTotalPrice = (calulatedPrice*qty);
		return [calulatedPrice, calulatedTotalPrice, save, rules];
	},
	setMoneyFormat: function(amount){		// Provission to show price with proper currency and template
		amount = amount/100;
		amount = amount.toFixed(2);
		return this.settings.priceTemplate.replace("0", amount);
	},
};

if (!window.jQuery) {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "//code.jquery.com/jquery-3.6.0.min.js";
	document.getElementsByTagName("head")[0].appendChild(script);
	((script.readyState) && (script.readyState == "loaded" || script.readyState == "complete")) ? script.onreadystatechange = function() {
		oscpCartTemplate.init();
	}: script.onload = function() {
		oscpCartTemplate.init();
	};
}else{
	oscpCartTemplate.init();
}