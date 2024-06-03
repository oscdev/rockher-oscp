package tagged_Customer;

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

public class C_Tag_Product_Percent_III 
{
	@Test
	public void f() throws InterruptedException, IOException 
	{
		//System.setProperty("webdriver.gecko.driver","D:\\selenium jars & drivers\\Drivers\\firefox drivers\\geckodriver.exe");
		
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
		driver.findElement(By.id("CustomerEmail")).sendKeys("amrita@oscprofessionals.com");
		driver.findElement(By.id("CustomerPassword")).sendKeys("amrita");
		
		// Click on Sign in button
		driver.findElement(By.xpath("//button[normalize-space()='Sign in']")).click();

		// Product Name-Dreamcatcher Pendant Necklace [Variants - 1.Black 2.Blue]

		// Click on search icon
		driver.findElement(By.xpath("//summary[@aria-label='Search']")).click();
		
		// Click on search bar and put the data
		driver.findElement(By.id("Search-In-Modal")).sendKeys("Dreamcatcher Pendant Necklace");
		driver.findElement(By.xpath("//button[@class='search__button field__button']")).click();
		
		// Go to product page
		driver.findElement(By.id("CardLink--8792166072612")).click();
		
		// Add quantity
		int i;
		for(i=1;i<=1;i++) 
		{
			driver.findElement(By.name("plus")).click();
		}
		
		//click on add to cart button
		driver.findElement(By.id("ProductSubmitButton-template--18567496368420__main")).click();
		Thread.sleep(2000);
		
		// Screenshot of product page //
	    // Convert web driver object to TakeScreenshot
	    TakesScreenshot ts = (TakesScreenshot) driver;
	    // Call getScreenshotAs method to create image file
	    File source = ts.getScreenshotAs(OutputType.FILE);
	    // Copy file at destination
	    FileHandler.copy(source, new File("D:\\All Selenium Webdriver Screenshots\\OSCP CPW Live app\\Tagged Customer\\Product-Percent\\Screenshots" 
	                                                   + System.currentTimeMillis() + ".png"));
	    System.out.println("The Screenshot of Product Page is taken");
		Thread.sleep(3000);

		// Click on view cart button
		driver.findElement(By.id("cart-notification-button")).click();
		
		// Comparing prices on cart page
		WebElement subtotal = driver.findElement(By.xpath("//p[@class='totals__subtotal-value']"));
		String ActualsubTotal = subtotal.getText();
	    System.out.println("Actual subtotal price is: " +ActualsubTotal);
		Thread.sleep(2000);
		
		String ExpectedSubTotal="Rs. 306.00";
		Thread.sleep(2000);
		   
		// Screenshot of cart page //
		
	    // Convert web driver object to TakeScreenshot
	    TakesScreenshot ts1 = (TakesScreenshot) driver;

	    // Call getScreenshotAs method to create image file
	    File source1 = ts1.getScreenshotAs(OutputType.FILE);

	    // Copy file at destination
	    FileHandler.copy(source1, new File("D:\\All Selenium Webdriver Screenshots\\OSCP CPW Live app\\Tagged Customer\\Product-Percent\\Screenshots" 
	                                                   + System.currentTimeMillis() + ".png"));
	    System.out.println("The Screenshot of Shopping-Cart Page is taken");
	    Thread.sleep(2000);
	    
		if(ActualsubTotal.equalsIgnoreCase(ExpectedSubTotal)) 
		      { 
			         // Click on Checkout button
			         driver.findElement(By.xpath("//button[@id='checkout']")).click();
		      }
		Thread.sleep(5000);
	      
		// Comparing prices on checkout page	
	    
	    // Without including Tax 
		WebElement Subtotal1 = driver.findElement(By.xpath("//span[@class='_19gi7yt0 _19gi7yth _1fragemfq _19gi7yt1 notranslate']"));
		String ActualSubTotal1 = Subtotal1.getText();
		System.out.println("Actual Subtotal price on Checkout is: " +ActualSubTotal1);
		Thread.sleep(2000);
		
		String ExpectedTotal1="Rs. 306.00";
	    Thread.sleep(2000);
	    
	    // Including Tax
		WebElement total2 = driver.findElement(By.xpath("//strong[@class='_19gi7yt0 _19gi7ytl _1fragemfs _19gi7yt1 notranslate']"));
		String ActualTotal2 = total2.getText();
		System.out.println("Actual Total price on Checkout is: " +ActualTotal2);
		Thread.sleep(2000);
		
		String ExpectedTotal3="₹333.54";
	    Thread.sleep(2000);
	

		// Screenshot of checkout page //
		 
		// Convert web driver object to TakeScreenshot
	    TakesScreenshot ts2 = (TakesScreenshot) driver;

	    // Call getScreenshotAs method to create image file
	    File source2 = ts2.getScreenshotAs(OutputType.FILE);

	    // Copy file at destination
	    FileHandler.copy(source2, new File("D:\\All Selenium Webdriver Screenshots\\OSCP CPW Live app\\Tagged Customer\\Product-Percent\\Screenshots" + System.currentTimeMillis() + ".png"));
	    System.out.println("The Screenshot of Checkout Page is taken");
		
	    // Navigate back to Shopping Cart page 
		driver.get("https://v2-cpw-test-app.myshopify.com/cart");
		
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
