package All_Customer;

import java.io.File;

import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.io.FileHandler;
import org.testng.annotations.Test;

public class All_Variant_fixed_II 
{
	@Test
	public void f() throws Exception 
	{
		System.setProperty("webdriver.gecko.driver","D:\\selenium jar & Drivers\\drivers\\firefox drivers\\geckodriver.exe");

		// Open browser and launch site
		WebDriver driver = new FirefoxDriver();
		driver.get("https://cpw-app-v4.myshopify.com/");
		driver.manage().window().maximize();
		driver.findElement(By.id("password")).sendKeys("OSC123");
		driver.findElement(By.xpath("//button[@type='submit']")).click();
		Thread.sleep(2000);
		
		// Click on search icon
		driver.findElement(By.xpath("//summary[@aria-label='Search']")).click();
		
		// Click on search bar and put the data
		// "Product Name - Moon Charm Bracelet" VIP Tag
		driver.findElement(By.id("Search-In-Modal")).sendKeys("Moon Charm Bracelet");
		driver.findElement(By.xpath("//button[@class='search__button field__button']")).click();
		
		// Go to product page
		driver.findElement(By.id("CardLink--8786366529820")).click();

		// Screenshot of product page //
		
	    // Convert web driver object to TakeScreenshot
	    TakesScreenshot ts = (TakesScreenshot) driver;

	    // Call getScreenshotAs method to create image file
	    File source = ts.getScreenshotAs(OutputType.FILE);

	    // Copy file at destination
	    FileHandler.copy(source, new File("D:\\All Selenium Webdriver Screenshots\\CPW Dev Testing\\I_All_Customer\\Variant-fixed"+System.currentTimeMillis()+".png"));
	    System.out.println("The Screenshot of Product Page is taken");
	    
		//Add quantity - 2
		int i;
		for(i=1;i<=1;i++) 
		{
			driver.findElement(By.name("plus")).click();
		}
		
		//click on add to cart button
		driver.findElement(By.id("ProductSubmitButton-template--20808972271900__main")).click();
		Thread.sleep(2000);
		
		// Click on view cart button
		driver.findElement(By.id("cart-icon-bubble")).click();
		
		// Comparing prices on cart page
		WebElement subtotal = driver.findElement(By.xpath("(//span[@class='price price--end'])[2]"));
		String ActualsubTotal = subtotal.getText();
	    System.out.println("Actual subtotal price is: " +ActualsubTotal);
		Thread.sleep(2000);
		
		String ExpectedSubTotal="Rs. 280.00";
		Thread.sleep(2000);
		   
		// Screenshot of cart page //
		
	    // Convert web driver object to TakeScreenshot
	    TakesScreenshot ts1 = (TakesScreenshot) driver;

	    // Call getScreenshotAs method to create image file
	    File source1 = ts1.getScreenshotAs(OutputType.FILE);

	    // Copy file at destination
	    FileHandler.copy(source1, new File("D:\\All Selenium Webdriver Screenshots\\CPW Dev Testing\\I_All_Customer\\Variant-fixed\\Screenshots"+System.currentTimeMillis()+".png"));
	    System.out.println("The Screenshot of Shopping-Cart Page is taken");
	    Thread.sleep(2000);
	    
	    if(ActualsubTotal.equalsIgnoreCase(ExpectedSubTotal))
	    {
			//Add quantity - 5
	
			for(i=1;i<=3;i++) 
			{
				driver.findElement(By.name("plus")).click();
			}
			Thread.sleep(2000);
						
			// Comparing prices on cart page
			WebElement subtotal1 = driver.findElement(By.xpath("(//span[@class='price price--end'])[2]"));
			String ActualsubTotal1 = subtotal1.getText();
		    System.out.println("Actual subtotal price is: " +ActualsubTotal1);
			Thread.sleep(2000);
			
			String ExpectedSubTotal1="Rs. 675.00";
			Thread.sleep(2000);
			   
			// Screenshot of cart page //
			
		    // Convert web driver object to TakeScreenshot
		    TakesScreenshot ts2 = (TakesScreenshot) driver;

		    // Call getScreenshotAs method to create image file
		    File source2 = ts2.getScreenshotAs(OutputType.FILE);

		    // Copy file at destination
		    FileHandler.copy(source2, new File("D:\\All Selenium Webdriver Screenshots\\CPW Dev Testing\\I_All_Customer\\Variant-fixed\\Screenshots"+System.currentTimeMillis()+".png"));
		    System.out.println("The Screenshot of Shopping-Cart Page is taken");
		    Thread.sleep(2000);
	    
	              if(ActualsubTotal1.equalsIgnoreCase(ExpectedSubTotal1))
	              {
	      			//Add quantity - 10

	      			for(i=1;i<=5;i++) 
	      			{
	      				driver.findElement(By.name("plus")).click();
	      			}
	      			Thread.sleep(2000);
	      			
	      			// Comparing prices on cart page
	      			WebElement subtotal2 = driver.findElement(By.xpath("(//span[@class='price price--end'])[2]"));
	      			String ActualsubTotal2 = subtotal2.getText();
	      		    System.out.println("Actual subtotal price is: " +ActualsubTotal2);
	      			Thread.sleep(2000);
	      			
	      			String ExpectedSubTotal2="Rs. 1250.00";
	      			Thread.sleep(2000);
	      			   
	      			// Screenshot of cart page //
	      			
	      		    // Convert web driver object to TakeScreenshot
	      		    TakesScreenshot ts3 = (TakesScreenshot) driver;

	      		    // Call getScreenshotAs method to create image file
	      		    File source3 = ts3.getScreenshotAs(OutputType.FILE);

	      		    // Copy file at destination
	      		    FileHandler.copy(source3, new File("D:\\All Selenium Webdriver Screenshots\\CPW Dev Testing\\I_All_Customer\\Variant-fixed\\Screenshots"+System.currentTimeMillis()+".png"));
	      		    System.out.println("The Screenshot of Shopping-Cart Page is taken");
	      		    Thread.sleep(5000);
	              
	     if(ActualsubTotal2.equalsIgnoreCase(ExpectedSubTotal2)) 
		      { 
			         // Click on Checkout button
			         driver.findElement(By.id("checkout")).click();
		      }
		Thread.sleep(5000);
	    
		// Screenshot of checkout page //
		 
		// Convert web driver object to TakeScreenshot
	    TakesScreenshot ts4 = (TakesScreenshot) driver;

	    // Call getScreenshotAs method to create image file
	    File source4 = ts4.getScreenshotAs(OutputType.FILE);

	    // Copy file at destination
	    FileHandler.copy(source4, new File("D:\\All Selenium Webdriver Screenshots\\CPW Dev Testing\\I_All_Customer\\Variant-fixed\\Screenshots"+System.currentTimeMillis()+".png"));
	    System.out.println("The Screenshot of Checkout Page is taken");
		Thread.sleep(5000);

	    // Comparing prices on checkout page
	    // Without including Tax 
		WebElement Subtotal3 = driver.findElement(By.xpath("//span[@class='_19gi7yt0 _19gi7yth _1fragemfq _19gi7yt1 notranslate']"));
		String ActualSubTotal3 = Subtotal3.getText();
		System.out.println("Actual Subtotal price is: " +ActualSubTotal3);
		Thread.sleep(2000);
		
		String ExpectedTotal3="₹1250.00";
	    Thread.sleep(2000);
	    
	    // Including Tax
		WebElement total5 = driver.findElement(By.xpath("//strong[@class='_19gi7yt0 _19gi7ytl _1fragemfs _19gi7yt1 notranslate']"));
		String ActualTotal5 = total5.getText();
		System.out.println("Actual Total price is: " +ActualTotal5);
		Thread.sleep(2000);
		
		String ExpectedTotal5="₹1,362.50";
	    Thread.sleep(2000);
		   
	    if(ActualTotal5.equalsIgnoreCase(ExpectedTotal5)) 
		      { 
	    	      // Navigate back to Shopping Cart page 
	    	      driver.navigate().back();
		      }
	    Thread.sleep(5000);
		
		//click on delete icon
		driver.findElement(By.xpath("//a[@class='button button--tertiary']/child::*")).click();
		Thread.sleep(2000);
		
		driver.close();
		}
	   }
	}

}
