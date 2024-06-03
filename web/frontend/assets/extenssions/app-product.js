var oscpProductTemplate = {
	settings: {},
	init: function(){
		console.log("init started");
		var $this = this;
		if(typeof oscpCPWAppConfig == 'undefined'){
			eval(jQuery(document).find('script[type="text/oscpAppSetting"]').eq(0).text());
		}
	
		//$this.settings = (typeof oscpCPWAppConfig == 'undefined') ? {} : JSON.parse(oscpCPWAppConfig);
		$this.settings = (typeof oscpCPWAppConfig == 'undefined') ? {} : oscpCPWAppConfig;

		// console.log("oscpProductTemplate");

		//This function will check if the buy now button is available on shopify theme then disablle the button and append another buy it now button call
		jQuery(document).ready(function(){
			//$this.doesBuyNowButtonHaveFunctionalityOnShopifyPDP();
		});

		setTimeout(function() {
            var intervalPlace1a = setInterval(function() {
                if(jQuery('.shopify-payment-button__button.shopify-payment-button__button--unbranded').length) {
					$this.doesBuyNowButtonHaveFunctionalityOnShopifyPDP();
					clearInterval(intervalPlace1a);
                }
				console.log('intervalPlace1a')
            }, 1000);
        }, 1000);

		
		//Onclick buy it now button on product page will call this function get the variant id ,qty, price and tiered rule 
		jQuery(document).on('click', $this.settings.eleBuyNowBtn, function(e){
			console.log('Why clicked me 199')
			e.preventDefault();
			e.stopPropagation();
			console.log('Why clicked me 222')
			
			var url = new URL(window.location.href);
			var variantId = url.searchParams.get("variant");

			if((variantId == null) || (variantId == '')){
				variantId = $this.settings.priceGrid[0].id
			}
			const qty = $('.quantity__input').val();

			$this.draftBuyNow(variantId, qty, $this.settings.priceGrid, $this.settings.product)
			return false;
		})

		jQuery(document).on('change', 'input[name="id"]', function(e){
			if(typeof $this.settings.timer !== 'undefined'){
				clearTimeout($this.settings.timer);
			}

			$this.settings.timer = setTimeout(function(){
				$this.updatePrice();
				$this.setProductTemplate();
			}, 200);
		})
		document.addEventListener('cpw:product-init', function(evt) {
			setTimeout(function(){
				$this.updatePrice();
				$this.setProductTemplate();
			}, 200);
		})
        setTimeout(function(){
			$this.updatePrice();
            $this.setProductTemplate();
        }, 1000);
	},

	// This function is used to override the "Buy it now" button on the Shopify Product Detail Page (PDP) and call the draft order from the CPW app. It checks if the payButton element exists on the page, and if so, it hides the payButton element and appends a new button with the class "customBuyNow" to the closest div. The purpose of this function is to customize the behavior of the "Buy it now" button.
	doesBuyNowButtonHaveFunctionalityOnShopifyPDP: function(){
		
		
		
		/*if(payButton.length === 1){
			jQuery(payButton).css('display', 'none');
			jQuery(payButton).closest('div').append('<button class="customBuyNow">'+buyitnow+'</button>');
		}*/

		/*-----------------------BOF Change logic for buy it now button-----------------------*/
		//setTimeout(function() {
            //var intervalPlace1a = setInterval(function() {
               // if(jQuery('.shopify-payment-button__button.shopify-payment-button__button--unbranded').length) {
					//alert(jQuery('.shopify-payment-button__button.shopify-payment-button__button--unbranded').length)
					var payButton = jQuery('.shopify-payment-button__button.shopify-payment-button__button--unbranded');
		var buyitnow = this.settings.locales.grid.buyitnow;
					jQuery(payButton).closest('div').append('<button class="customBuyNow">'+buyitnow+'</button>');
					jQuery(payButton).css('display', 'none');
					//clearInterval(intervalPlace1a);
             //   }
          //  }, 2000)
        //}, 2000);
		/*-----------------------EOF Change logic for buy it now button-----------------------*/
	},

	//This function passed the data through ajax call to get the draft order
	draftBuyNow: function(variantId, qty, priceGrid, productPrice){ 	//Create and fetch draft order from server before checkout

		const rule = this.getApplicableBuyNowRule(variantId, qty, priceGrid);
		const ProductVariantBasePrice = this.getProductVariantBasePrice(variantId, productPrice)/100;	
		// console.log('rules === ', priceGrid)
		// console.log('variantId === ', variantId)
		// console.log('qty === ', qty)
		// console.log('rule === ', rule)
		$.ajax({
			type: "POST",
			data: JSON.stringify({
				"price": ProductVariantBasePrice,
				"variantId": variantId,
				"quantity": qty,
				"rule": rule
			}),
			contentType: 'application/json',
			url: '/apps/tier/appfront/draft-buy-now?shop='+Shopify.shop+'&s=os'+this.settings.secret+'cp',
			// url: 'https://simulation-previously-webmaster-rolls.trycloudflare.com/api/appfront/draft-buy-now?shop='+Shopify.shop+'&s=os'+this.settings.secret+'cp',
			success: function(result){	
				if(result.draft_order.invoice_url == ''){
					jQuery('.shopify-payment-button__button.shopify-payment-button__button--unbranded').click();
					// window.location.href = '/checkout';
				}else{
					window.location.href = result.draft_order.invoice_url;
				}					
			},
			complete: function(xhr, status){
				//if not success then submit the form
			}
		}).fail(function(){
			console.log('faild')
			jQuery('.shopify-payment-button__button.shopify-payment-button__button--unbranded').click();
			// window.location.href = '/checkout';
		});
	},

	//This function is used to get the applicable buy now rule based on the variant id and quantity through the pricegrid json
	getApplicableBuyNowRule: function(variantId, qty, priceGrid){
		var line = '';
		for(const [index, rules] of Object.entries(priceGrid)){	
			if(rules.id == variantId){
				for(const rule of rules.rules){					
					if(parseInt(qty) >= parseInt(rule.qty)){
						var line = rule;
					}
				}
			}
		}
		return line;
	},

	/*--------- Getting Product variant price from productPrice = oscpCPWAppConfig.settings.product---------*/
	getProductVariantBasePrice: function(variantId, productPrice){
		for (let i = 0; i < productPrice.variants.length; i++) { 
			if(productPrice.variants[i].id == variantId) {	
				var ProductVariantPrice = productPrice.variants[i].price;
			}
		}
		return ProductVariantPrice;
	},

	sortQtyAscending: function(jsonData) {
		jsonData.forEach(item => {
		  item.rules.sort((a, b) => parseInt(a.qty) - parseInt(b.qty));
		});
		return jsonData;
	},
	getVariantIdFromURL: function(){
		var url = new URL(window.location.href);
		var variantId = url.searchParams.get("variant");
		return variantId || this.settings.product.variants[0].id; 
	},
	updatePrice: function () {
		$(".original-price del").text("");
		$(".discounted-price").text("");
		$(".modify_price").text("");
		var currentVariantId = this.getVariantIdFromURL();

		this.settings.priceGrid = this.sortQtyAscending(
			this.settings.priceGrid
		);
		var variantPrice = "";
		for (var v = 0; v < this.settings.product.variants.length; v++) {
			if (this.settings.product.variants[v].id == currentVariantId) {
				variantPrice = this.settings.product.variants[v].price;
				console.log(variantPrice);
			}
		}

		if (this.settings.priceGrid.length == 0) {
			$(".modify_price").text(this.setMoneyFormat(variantPrice));
		}

		for (var j = 0; j < this.settings.priceGrid.length; j++) {
			let checkVariantRuleId = true;

			for (let j = 0; j < this.settings.priceGrid.length; j++) {
				if (
					this.settings.priceGrid[j].id == currentVariantId &&
					this.settings.priceGrid[j].rules.length == 1
				) {
					checkVariantRuleId = false;
					console.log(
						"this.settings.priceGrid[j].id: ",
						this.settings.priceGrid[j].id
					);
					console.log(
						"this.settings.priceGrid.length",
						this.settings.priceGrid.length
					);
					console.log(
						"this.settings.priceGrid[j].rules.length: ",
						this.settings.priceGrid[j].rules.length
					);
					var cancelledPrice = 0;
					var discountedPrice = 0;
					for (
						r = 0;
						r < this.settings.priceGrid[j].rules.length;
						r++
					) {
						var Rulevalue =
							this.settings.priceGrid[j].rules[r].value;
						console.log("Rule: ", Rulevalue);
						if (
							this.settings.priceGrid[j].rules[r].type ==
							"percent"
						) {
							cancelledPrice = variantPrice;
							discountedPrice =
								variantPrice *
								(1 -
									this.settings.priceGrid[j].rules[r].value /
										100);
						} else {
							cancelledPrice = variantPrice;
							discountedPrice =
								this.settings.priceGrid[j].rules[r].value * 100;
						}
					}
					$(".original-price del").text(
						this.setMoneyFormat(cancelledPrice)
					);
					$(".discounted-price").text(
						this.setMoneyFormat(discountedPrice)
					);
					break;
				}
			}
			if (checkVariantRuleId) {
				$(".modify_price").text(this.setMoneyFormat(variantPrice));
			} 
		}
	},
	setProductTemplate: function(){		
		if(!this.settings.priceGrid[0].hasOwnProperty('rules')){
			return;
		}

		$('#oscpPriceGrid').remove();
	    var currentVariantId = this.getVariantIdFromURL();

		this.settings.priceGrid = this.sortQtyAscending(this.settings.priceGrid);
		var variantPrice = '';
		for(var v=0; v<this.settings.product.variants.length; v++){
			if(this.settings.product.variants[v].id == currentVariantId){
				variantPrice = this.settings.product.variants[v].price;
			}
		}

		for(var j=0; j<this.settings.priceGrid.length; j++){
			if((this.settings.priceGrid[j].id == currentVariantId) && this.settings.priceGrid[j].rules.length){

				$('.cpw-product__price').html('<s data-compare-price>'+this.setMoneyFormat(variantPrice)+'</s> <span class="" data-price=""> '+this.setMoneyFormat(this.settings.priceGrid[j].rules[0].value*100)+"</span>")
				
				var qtybreakHtml = "<table id='oscpPriceGrid'><tr><th>" +this.settings.locales.grid.qty + "</th><th>" +this.settings.locales.grid.price + "</th></tr>";
				for(i=0; i<this.settings.priceGrid[j].rules.length; i++){

				var rowPrice = this.settings.priceGrid[j].price;
				var rowrules = this.settings.priceGrid[j].rules[i];

				rowrules.type = (rowrules.type == 'discount') ? 'percent' : rowrules.type;

					var price = this.getLineItemPrice((rowPrice*100), rowrules , 1);
					//var price = [10,20,30];
					var Pricerules = (rowrules.type == 'percent') ? rowrules.value + " "+"%   "+ this.settings.locales.grid.off : (this.setMoneyFormat(rowrules.value*100) + " "+ this.settings.locales.grid.each);

					qtybreakHtml += "<tr><td>"+ this.settings.locales.grid.buy + " " +this.settings.priceGrid[j].rules[i].qty+"</td><td>"+Pricerules+"</td></tr>";
				}
				qtybreakHtml += "</table>";
				
				$('#oscpPriceGridContainer').append(qtybreakHtml);
			}
		}
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
		oscpProductTemplate.init();
	}: script.onload = function() {
		oscpProductTemplate.init();
	};
}else{
	oscpProductTemplate.init();
}
