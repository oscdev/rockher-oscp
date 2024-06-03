package Tagged_Customer;

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

public class CTag_Product_Fixed_III_C1 
{

	@Test
	public void f() throws InterruptedException, IOException {
		System.setProperty("webdriver.gecko.driver","D:\\selenium jar & Drivers\\drivers\\firefox drivers\\geckodriver.exe");
		
		// Open browser and launch site
		WebDriver driver = new FirefoxDriver();
		driver.get("https://cpw-app-v4.myshopify.com/");
		driver.manage().window().maximize();
		driver.findElement(By.id("password")).sendKeys("OSC123");
		driver.findElement(By.xpath("//button[@type='submit']")).click();
		Thread.sleep(2000);
		
		// Click on login icon
		driver.get("https://cpw-app-v4.myshopify.com/account");
		
		// Click on Email & Password fields
		driver.findElement(By.id("CustomerEmail")).sendKeys("amrita@oscprofessionals.com");
		driver.findElement(By.id("CustomerPassword")).sendKeys("amrita");
		
		// Click on Sign in button
		driver.findElement(By.xpath("//button[normalize-space()='Sign in']")).click();
		
		// Click on search icon
		driver.findElement(By.xpath("//summary[@aria-label='Search']")).click();
		
		// Click on search bar and put the data
				driver.findElement(By.id("Search-In-Modal")).sendKeys("Choker with Bead");
				driver.findElement(By.xpath("//button[@class='search__button field__button']")).click();
				
				// Go to product page
				driver.findElement(By.id("CardLink--8786365710620")).click();
				Thread.sleep(3000);
				
				// Screenshot of product page //
			    // Convert web driver object to TakeScreenshot
			    TakesScreenshot tss = (TakesScreenshot) driver;
			    // Call getScreenshotAs method to create image file
			    File sources = tss.getScreenshotAs(OutputType.FILE);
			    // Copy file at destination
			    FileHandler.copy(sources, new File("D:\\All Selenium Webdriver Screenshots\\CPW Dev Testing\\III_Tagged_Customer\\Product-Fixed\\Screenshots" 
			                                                   + System.currentTimeMillis() + ".png"));
			    System.out.println("The Screenshot of Product Page is taken");
				
				//Add quantity -5
				int i;
				for(i=1;i<=4;i++) 
				{
					driver.findElement(By.name("plus")).click();
				}
				
				//click on add to cart button
				driver.findElement(By.id("ProductSubmitButton-template--20808972271900__main")).click();
				Thread.sleep(2000);

		// Click on search icon
		driver.findElement(By.xpath("//summary[@aria-label='Search']")).click();
		
		// Click on search bar and put the data
		driver.findElement(By.id("Search-In-Modal")).sendKeys("Choker with Gold Pendant");
		driver.findElement(By.xpath("//button[@class='search__button field__button']")).click();
		
		// Go to product page
		driver.findElement(By.id("CardLink--8786365776156")).click();
		Thread.sleep(3000);
		
		// Screenshot of product page //
	    // Convert web driver object to TakeScreenshot
	    TakesScreenshot ts = (TakesScreenshot) driver;
	    // Call getScreenshotAs method to create image file
	    File source = ts.getScreenshotAs(OutputType.FILE);
	    // Copy file at destination
	    FileHandler.copy(source, new File("D:\\All Selenium Webdriver Screenshots\\CPW Dev Testing\\III_Tagged_Customer\\Product-Fixed\\Screenshots" 
	                                                   + System.currentTimeMillis() + ".png"));
	    System.out.println("The Screenshot of Product Page is taken");
		
		//Add quantity -10
		for(i=1;i<=9;i++) 
		{
			driver.findElement(By.name("plus")).click();
		}
		
		//click on add to cart button
		driver.findElement(By.id("ProductSubmitButton-template--20808972271900__main")).click();
		Thread.sleep(2000);
		
		//click on silver
		driver.findElement(By.xpath("//label[@for='template--20808972271900__main-1-1']")).click();
		
		//Add quantity -10
		for(i=1;i<=10;i++) 
		{
			driver.findElement(By.name("plus")).click();
		}
		
		//click on add to cart button
		driver.findElement(By.id("ProductSubmitButton-template--20808972271900__main")).click();
		Thread.sleep(2000);
		
		// Click on view cart button
		driver.findElement(By.id("cart-notification-button")).click();
		
		// Comparing prices on cart page
		WebElement Estimated_total = driver.findElement(By.xpath("//p[@class='totals__total-value']"));
		String Actual_Total = Estimated_total.getText();
	    System.out.println("Actual Estimated total price is: " +Actual_Total);
		Thread.sleep(2000);
		
		String Expected_Total="Rs. 3500.00";
		Thread.sleep(2000);
		
		// Screenshot of cart page //
	    // Convert web driver object to TakeScreenshot
	    TakesScreenshot ts1 = (TakesScreenshot) driver;
	    // Call getScreenshotAs method to create image file
	    File source1 = ts1.getScreenshotAs(OutputType.FILE);
	    // Copy file at destination
	    FileHandler.copy(source1, new File("D:\\All Selenium Webdriver Screenshots\\CPW Dev Testing\\III_Tagged_Customer\\Product-Fixed\\Screenshots" 
	                                                   + System.currentTimeMillis() + ".png"));
	    System.out.println("The Screenshot of Shopping-Cart Page is taken");
	    Thread.sleep(2000);
	    
		if(Actual_Total.equalsIgnoreCase(Expected_Total)) 
		      {
  				        // Click on Checkout button
  				         driver.findElement(By.id("checkout")).click();
  			      }
		      
		Thread.sleep(7000);
		
		// Comparing prices on checkout page
	    // Without including Tax 
		WebElement Subtotal1 = driver.findElement(By.xpath("//span[@class='_19gi7yt0 _19gi7yth _1fragemfq _19gi7yt1 notranslate']"));
		String ActualSubTotal1 = Subtotal1.getText();
		System.out.println("Actual Subtotal price on Checkout is: " +ActualSubTotal1);
		Thread.sleep(2000);
		String ExpectedSubtotal1="₹3,500.00";
	    Thread.sleep(2000);
	    
	    // Including Tax
		WebElement total2 = driver.findElement(By.xpath("//strong[@class='_19gi7yt0 _19gi7ytl _1fragemfs _19gi7yt1 notranslate']"));
		String ActualTotal2 = total2.getText();
		System.out.println("Actual Total price on Checkout is: " +ActualTotal2);
		Thread.sleep(2000);
		String ExpectedTotal3="₹3,815.00";
	    Thread.sleep(2000);
	  
		// Screenshot of checkout page 
		// Convert web driver object to TakeScreenshot
	    TakesScreenshot ts4 = (TakesScreenshot) driver;
	    // Call getScreenshotAs method to create image file
	    File source4 = ts4.getScreenshotAs(OutputType.FILE);
	    // Copy file at destination
	    FileHandler.copy(source4, new File("D:\\All Selenium Webdriver Screenshots\\CPW Dev Testing\\III_Tagged_Customer\\Product-Fixed\\Screenshots"+System.currentTimeMillis()+".png"));
	    System.out.println("The Screenshot of Checkout Page is taken");
		Thread.sleep(2000);

		   
	    if(ActualTotal2.equalsIgnoreCase(ExpectedTotal3)) 
		      { 
	    	      // Navigate back to Shopping Cart page 
	    	      driver.navigate().back();
		      }
	    Thread.sleep(5000);
		
		//click on delete icon
		driver.findElement(By.xpath("//a[@class='button button--tertiary']/child::*")).click();
		Thread.sleep(2000);
		
		// Click on login icon
		//driver.findElement(By.xpath("//a[@class='header__icon header__icon--account link focus-inset small-hide']")).click();
		driver.get("https://cpw-app-v4.myshopify.com/account");

		// Click on Log out link
		driver.findElement(By.xpath("//a[@href='/account/logout']")).click();
		Thread.sleep(2000);
	    System.out.println("Successfully Logout");

		driver.close();
	}

}


