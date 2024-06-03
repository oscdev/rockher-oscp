package loggedIn_Customer;

import java.io.File;
import java.io.IOException;

import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.io.FileHandler;
import org.testng.annotations.Test;

public class LoggedIn_Variant_fixed_I_C2 
{
	@Test
	public void f() throws InterruptedException, IOException {
		System.setProperty("webdriver.gecko.driver","D:\\selenium jar & Drivers\\drivers\\firefox drivers\\geckodriver.exe");
		
		// Open browser and launch site
		WebDriver driver = new FirefoxDriver();
		driver.get("https://v2-cpw-test-app.myshopify.com/");
		driver.manage().window().maximize();
		driver.findElement(By.id("password")).sendKeys("OSC123");
		driver.findElement(By.xpath("//button[@type='submit']")).click();
		Thread.sleep(2000);
		
		// Click on login icon
		driver.findElement(By.xpath("(//a[@href='/account/login'])[2]")).click();
		
		// Click on Email & Password fields
		driver.findElement(By.id("CustomerEmail")).sendKeys("priti@oscprofessionals.in");
		driver.findElement(By.id("CustomerPassword")).sendKeys("ensyspass0101");
		Thread.sleep(3000);
		
		// Click on Sign in button
		driver.findElement(By.xpath("//button[normalize-space()='Sign in']")).click();
		Thread.sleep(3000);
		
		// Click on search icon
		driver.findElement(By.xpath("//summary[@aria-label='Search']")).click();
		
		// Click on search bar and put the data
		driver.findElement(By.id("Search-In-Modal")).sendKeys("Galaxy Earrings");
		driver.findElement(By.xpath("//button[@class='search__button field__button']")).click();
		
		// Go to product page
		driver.findElement(By.id("CardLink--8792166203684")).click();

		// Screenshot of product page //
		
	    // Convert web driver object to TakeScreenshot
	    TakesScreenshot ts = (TakesScreenshot) driver;

	    // Call getScreenshotAs method to create image file
	    File source = ts.getScreenshotAs(OutputType.FILE);

	    // Copy file at destination
	    FileHandler.copy(source, new File("D:\\All Selenium Webdriver Screenshots\\OSCP CPW Live app\\LoggedIn Customer\\Variant-fixed\\Screenshots" 
	                                                   + System.currentTimeMillis() + ".png"));
	    System.out.println("The Screenshot of Product Page is taken");

		//Add quantity
		int i;
		for(i=1;i<=1;i++) 
		{
			driver.findElement(By.name("plus")).click();
		}
		
		// Click on Name to LineItem Box
		driver.findElement(By.id("name")).sendKeys("Test 123");
		
		//click on add to cart button
		driver.findElement(By.id("ProductSubmitButton-template--18567496368420__main")).click();
		Thread.sleep(2000);
		
		// Click on view cart button
		driver.findElement(By.id("cart-notification-button")).click();
		
		// Compare LineItem Name on cart page
		WebElement LineItem = driver.findElement(By.xpath("(//div[@class='product-option'])[2]/child::dd"));
		String Actual_LineItem = LineItem.getText();
	    System.out.println("Actual Name to LineItem is: "+Actual_LineItem);
		Thread.sleep(2000);
		String Expected_Actual_LineItem="Test 123";
		Thread.sleep(2000);
		
		if(Actual_LineItem.equalsIgnoreCase(Expected_Actual_LineItem))
		{	
		
		// Click on Order special instructions Box
		driver.findElement(By.id("Cart-note")).sendKeys("Test CPW ");
			
		// Comparing prices on cart page
		WebElement Subtotal = driver.findElement(By.xpath("(//div[@class='cart-item__price-wrapper'])[2]/child::span"));
		String ActualSubTotal = Subtotal.getText();
	    System.out.println("Actual Subtotal Price is: "+ActualSubTotal);
		Thread.sleep(2000);
		String ExpectedSubTotal="Rs. 66.00";
		Thread.sleep(2000);
		   
		// Screenshot of cart page //
		
	    // Convert web driver object to TakeScreenshot
	    TakesScreenshot ts1 = (TakesScreenshot) driver;

	    // Call getScreenshotAs method to create image file
	    File source1 = ts1.getScreenshotAs(OutputType.FILE);

	    // Copy file at destination
	    FileHandler.copy(source1, new File("D:\\All Selenium Webdriver Screenshots\\OSCP CPW Live app\\LoggedIn Customer\\Variant-fixed\\Screenshots" 
	                                                   + System.currentTimeMillis() + ".png"));
	    System.out.println("The Screenshot of Shopping-Cart Page is taken");
	    Thread.sleep(5000);
	   
	    if(ActualSubTotal.equalsIgnoreCase(ExpectedSubTotal))
	    {
	    	// Add quantity
			for(i=1;i<=3;i++) 
			{
				driver.findElement(By.name("plus")).click();
				Thread.sleep(5000);
				// Comparing prices on cart page
				WebElement Subtotal_1 = driver.findElement(By.xpath("(//div[@class='cart-item__price-wrapper'])[2]/child::span"));
				String ActualSubTotal_1 = Subtotal_1.getText();
			    System.out.println("Actual subtotal price is: "+ActualSubTotal_1);
				Thread.sleep(2000);
				
				String ExpectedSubTotal_1="Rs. 140.00";
				Thread.sleep(2000);
	      
				// Screenshot of cart page //
				
			    // Convert web driver object to TakeScreenshot
			    TakesScreenshot ts2 = (TakesScreenshot) driver;

			    // Call getScreenshotAs method to create image file
			    File source2 = ts2.getScreenshotAs(OutputType.FILE);

			    // Copy file at destination
			    FileHandler.copy(source2, new File("D:\\All Selenium Webdriver Screenshots\\OSCP CPW Live app\\LoggedIn Customer\\Variant-fixed\\Screenshots" 
			                                                   + System.currentTimeMillis() + ".png"));
			    System.out.println("The Screenshot of Shopping-Cart Page is taken");
			    Thread.sleep(2000);
			    
			    if(ActualSubTotal_1.equalsIgnoreCase(ExpectedSubTotal_1))
			    {
			    	// Add quantity
					for(i=1;i<=5;i++) 
					{
						driver.findElement(By.name("plus")).click();
						Thread.sleep(5000);
						
						// Comparing prices on cart page
						WebElement Subtotal_2 = driver.findElement(By.xpath("(//div[@class='cart-item__price-wrapper'])[2]/child::span"));
						String ActualSubTotal_2 = Subtotal_2.getText();
					    System.out.println("Actual subtotal price is: "+ActualSubTotal_2);
						Thread.sleep(2000);
						
						String ExpectedSubTotal_2="Rs. 230.00";
						Thread.sleep(2000);
						
						// Screenshot of cart page //
						
					    // Convert web driver object to TakeScreenshot
					    TakesScreenshot ts3 = (TakesScreenshot) driver;

					    // Call getScreenshotAs method to create image file
					    File source3 = ts3.getScreenshotAs(OutputType.FILE);

					    // Copy file at destination
					    FileHandler.copy(source3, new File("D:\\All Selenium Webdriver Screenshots\\OSCP CPW Live app\\LoggedIn Customer\\Variant-fixed\\Screenshots" 
					                                                   + System.currentTimeMillis() + ".png"));
					    System.out.println("The Screenshot of Shopping-Cart Page is taken");
					    Thread.sleep(2000);
					    
					    Thread.sleep(2000);
					    
		if(ActualSubTotal_2.equalsIgnoreCase(ExpectedSubTotal_2)) 
		      { 
			         // Click on Checkout button
			         driver.findElement(By.xpath("//button[@id='checkout']")).click();
		             Thread.sleep(5000);
	      
		     		// Compare LineItem Name on Checkout page
		     		WebElement LineItem_1 = driver.findElement(By.xpath("//li[@class='_1bzftbj7 _1frageme0']/child::span"));
		     		String Actual_LineItem_1 = LineItem_1.getText();
		     	    System.out.println("Actual "+Actual_LineItem_1);
		     		Thread.sleep(2000);
		     		String Expected_Actual_LineItem_1="Name to LineItem: Test 123";
		     		Thread.sleep(2000);
		     		
		// Comparing prices on checkout page	
	    
	    // Without Including Tax 
		WebElement Subtotal_3 = driver.findElement(By.xpath("//span[@class='_19gi7yt0 _19gi7yth _1fragemfq _19gi7yt1 notranslate']"));
		String ActualSubTotal_3 = Subtotal_3.getText();
		System.out.println("Actual Subtotal price on Checkout is: "+ActualSubTotal_3);
		Thread.sleep(2000);
		String ExpectedTotal_3="₹230.00";
	    Thread.sleep(2000);
	    
	    // With Including Tax
		WebElement Total = driver.findElement(By.xpath("//strong[@class='_19gi7yt0 _19gi7ytl _1fragemfs _19gi7yt1 notranslate']"));
		String ActualTotal = Total.getText();
		System.out.println("Actual Total price on Checkout is: " +ActualTotal);
		Thread.sleep(2000);
		String ExpectedTotal="₹250.70";
	    Thread.sleep(2000);
		// Screenshot of checkout page //
		 
		// Convert web driver object to TakeScreenshot
	    TakesScreenshot ts4 = (TakesScreenshot) driver;

	    // Call getScreenshotAs method to create image file
	    File source4 = ts4.getScreenshotAs(OutputType.FILE);

	    // Copy file at destination
	    FileHandler.copy(source4, new File("D:\\All Selenium Webdriver Screenshots\\OSCP CPW Live app\\LoggedIn Customer\\Variant-fixed\\Screenshots" + System.currentTimeMillis() + ".png"));
	    System.out.println("The Screenshot of Checkout Page is taken");
		   
	    if(ActualTotal.equalsIgnoreCase(ExpectedTotal)) 
	      { 
	             // Navigate back to Shopping Cart page 
  	         driver.navigate().back();
	      }
  Thread.sleep(2000);
	
	//click on empty cart button
	driver.findElement(By.xpath("//a[@class='customcartitems btn button']")).click();
	Thread.sleep(3000);
	
	// Click on login icon
	driver.findElement(By.xpath("//a[@class='header__icon header__icon--account link focus-inset small-hide']")).click();

	// Click on Log out link
	driver.findElement(By.xpath("//a[@href='/account/logout']")).click();
	Thread.sleep(3000);
  System.out.println("Successfully Logout");

	driver.close();
  }
 }
}
}
}
}
}
}

	