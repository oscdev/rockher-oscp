package all_Customer;

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

public class All_Product_Fixed_I {

	@Test
	public void f() throws InterruptedException, IOException {
		
		//System.setProperty("webdriver.gecko.driver","D:\\Selenium\\drivers\\firefox\\geckodriver.exe");
		WebDriver driver = new FirefoxDriver();
		
		driver.get("https://v2-cpw-test-app.myshopify.com/");
		driver.findElement(By.id("password")).sendKeys("OSC123");
		driver.findElement(By.xpath("//button[@type='submit']")).click();
		Thread.sleep(2000);
		driver.manage().window().maximize();
		
		//Click on Search icon
		WebElement search = driver.findElement(By.xpath("//summary[@aria-label='Search']//span//*[name()='svg']"));
		search.click();
		
		driver.findElement(By.id("Search-In-Modal")).sendKeys("Choker with Bead");
		driver.findElement(By.xpath("//button[@aria-label='Search']//*[name()='svg']")).click();
		
		//Opening product page
		driver.findElement(By.id("CardLink--8792165515556")).click();
		
		// Screenshot of product page //
	    // Convert web driver object to TakeScreenshot
	    TakesScreenshot ts = (TakesScreenshot) driver;
	    // Call getScreenshotAs method to create image file
	    File source = ts.getScreenshotAs(OutputType.FILE);
	    // Copy file at destination
	    FileHandler.copy(source, new File("D:\\All Selenium Webdriver Screenshots\\OSCP CPW Live app\\All Customer\\Product_Fixed\\Screenshots"+System.currentTimeMillis()+".png"));
	    System.out.println("The Screenshot of Product Page is taken");
	    
	  //Add quantity-5
	  		int i;
	  		for(i=1;i<5;i++) 
	  		{
	  			driver.findElement(By.xpath("//button[@name='plus']")).click();
	  		}
	  		
	  		//click on add to cart button
	  				driver.findElement(By.id("ProductSubmitButton-template--18567496368420__main")).click();
	  				Thread.sleep(2000);
	  		
	  		Thread.sleep(2000);
	  		//click on view cart button
	  		//driver.findElement(By.id("cart-notification-button")).click();
	  		driver.findElement(By.xpath("//a[@id='cart-notification-button']")).click();
	  		
	  		
	  		//camparing prices on cart page
	  		   WebElement subtotal = driver.findElement(By.xpath("(//span[@class='price price--end'])[2]"));
	  		   String ActualsubTotal = subtotal.getText();
	  		   System.out.println("Actual subtotal price is: " +ActualsubTotal);
	  		   Thread.sleep(4000);
	  		   String ExpectedSubTotal="Rs. 550.00";
	  		   Thread.sleep(2000);
	  		   
	  		   /**** Screenshot of cart page ******/
	  			 // Convert web driver object to TakeScreenshot
	  	    TakesScreenshot ts2 = (TakesScreenshot) driver;

	  	    // Call getScreenshotAs method to create image file
	  	    File source2 = ts2.getScreenshotAs(OutputType.FILE);

	  	    // Copy file at destination
	  	    FileHandler.copy(source2, new File("D:\\All Selenium Webdriver Screenshots\\OSCP CPW Live app\\All Customer\\Product_Fixed\\screenshots" + System.currentTimeMillis() + ".png"));
	  	    System.out.println("the Screenshot of cart page is taken");
	  	    
	  	    
	  		   if(ActualsubTotal.equalsIgnoreCase(ExpectedSubTotal)) 
	  		      { 
	  			 //Add quantity - 10
	  				for(i=1;i<=5;i++) 
	  				{
	  					driver.findElement(By.name("plus")).click();
	  				}
	  				Thread.sleep(10000);
	  							
	  				// Comparing prices on cart page
	  				WebElement subtotal1 = driver.findElement(By.xpath("(//span[@class='price price--end'])[2]"));
	  				String ActualsubTotal1 = subtotal1.getText();
	  			    System.out.println("Actual subtotal price is: " +ActualsubTotal1);
	  				Thread.sleep(2000);
	  				
	  				String ExpectedSubTotal1="Rs. 1000.00";
	  				Thread.sleep(2000);
	  				   
	  				// Screenshot of cart page //
	  				
	  			    // Convert web driver object to TakeScreenshot
	  			    TakesScreenshot ts3 = (TakesScreenshot) driver;

	  			    // Call getScreenshotAs method to create image file
	  			    File source3 = ts3.getScreenshotAs(OutputType.FILE);

	  			    // Copy file at destination
	  			    FileHandler.copy(source3, new File("D:\\All Selenium Webdriver Screenshots\\OSCP CPW Live app\\All Customer\\Product_Fixed\\screenshots"+System.currentTimeMillis()+".png"));
	  			    System.out.println("The Screenshot of Shopping-Cart Page is taken");
	  			    Thread.sleep(2000);
	  		    
	  		              if(ActualsubTotal1.equalsIgnoreCase(ExpectedSubTotal1))
	  		              {
	  		      			//Add quantity - 20

	  		      			for(i=1;i<=10;i++) 
	  		      			{
	  		      				driver.findElement(By.name("plus")).click();
	  		      			}
	  		      			Thread.sleep(2000);
	  		      			
	  		      			// Comparing prices on cart page
	  		      			WebElement subtotal2 = driver.findElement(By.xpath("(//span[@class='price price--end'])[2]"));
	  		      			String ActualsubTotal2 = subtotal2.getText();
	  		      		    System.out.println("Actual subtotal price is: " +ActualsubTotal2);
	  		      			Thread.sleep(2000);
	  		      			
	  		      			String ExpectedSubTotal2="Rs. 1800.00";
	  		      			Thread.sleep(2000);
	  		      			   
	  		      			// Screenshot of cart page //
	  		      			
	  		      		    // Convert web driver object to TakeScreenshot
	  		      		    TakesScreenshot ts5 = (TakesScreenshot) driver;

	  		      		    // Call getScreenshotAs method to create image file
	  		      		    File source5 = ts5.getScreenshotAs(OutputType.FILE);

	  		      		    // Copy file at destination
	  		      		    FileHandler.copy(source5, new File("D:\\All Selenium Webdriver Screenshots\\OSCP CPW Live app\\All Customer\\Product_Fixed\\Screenshots"+System.currentTimeMillis()+".png"));
	  		      		    System.out.println("The Screenshot of Shopping-Cart Page is taken");
	  		      		    Thread.sleep(2000);
	  		              
	  		     if(ActualsubTotal2.equalsIgnoreCase(ExpectedSubTotal2)) 
	  			      { 
	  				         // Click on Checkout button
	  				         driver.findElement(By.id("checkout")).click();
	  				         Thread.sleep(2000);
	  			      }
	  			Thread.sleep(10000);
	  		    	    
	  		    // Comparing prices on checkout page
	  		    // Without including Tax 
	  			WebElement Subtotal3 = driver.findElement(By.xpath("//span[@class='_19gi7yt0 _19gi7yth _1fragemfq _19gi7yt1 notranslate']"));
	  			String Actual_SubTotal_3 = Subtotal3.getText();
	  			System.out.println("Actual Subtotal price is: " +Actual_SubTotal_3);
	  			Thread.sleep(2000);
	  			
	  			String Expected_Total_3="₹1800.00";
	  		    Thread.sleep(2000);
	  		 
	  		    // Including Tax
	  			WebElement total3 = driver.findElement(By.xpath("//strong[@class='_19gi7yt0 _19gi7ytl _1fragemfs _19gi7yt1 notranslate']"));
	  			String Actual_Total3 = total3.getText();
	  			System.out.println("Actual Total price is: " +Actual_Total3);
	  			Thread.sleep(2000);
	  			
	  			String Expected_Total3="₹1,962.00";
	  		    Thread.sleep(2000);
	  		    
	  			// Screenshot of checkout page //
	  			 
	  			// Convert web driver object to TakeScreenshot
	  		    TakesScreenshot ts4 = (TakesScreenshot) driver;

	  		    // Call getScreenshotAs method to create image file
	  		    File source4 = ts4.getScreenshotAs(OutputType.FILE);

	  		    // Copy file at destination
	  		    FileHandler.copy(source4, new File("D:\\All Selenium Webdriver Screenshots\\OSCP CPW Live app\\All Customer\\Product_Fixed\\Screenshots"+System.currentTimeMillis()+".png"));
	  		    System.out.println("The Screenshot of Checkout Page is taken");
	  			Thread.sleep(2000);
	  			   
	  		    if(Actual_Total3.equalsIgnoreCase(Expected_Total3)) 
	  			      { 
	  		    	      // Navigate back to Shopping Cart page 
	  		    	      driver.navigate().back();
	  			      }
	  		    Thread.sleep(2000);
		   
		   //click on empty cart button
		   driver.findElement(By.xpath("//a[@class='customcartitems btn button']")).click();
		
		   driver.close();

		
		
	
	  		              }}
	}

}
