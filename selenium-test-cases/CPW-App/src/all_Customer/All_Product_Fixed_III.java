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

public class All_Product_Fixed_III {

	@Test
	public void f() throws InterruptedException, IOException {
		
		//System.setProperty("webdriver.gecko.driver","D:\\Selenium\\drivers\\firefox\\geckodriver.exe");
		WebDriver driver = new FirefoxDriver();
		
		driver.get("https://v2-cpw-test-app.myshopify.com/");
		driver.findElement(By.id("password")).sendKeys("OSC123");
		driver.findElement(By.xpath("//button[@type='submit']")).click();
		Thread.sleep(2000);
		driver.manage().window().maximize();
		
		//1. Click on Search icon
		WebElement search = driver.findElement(By.xpath("//summary[@aria-label='Search']//span//*[name()='svg']"));
		search.click();
		
		driver.findElement(By.id("Search-In-Modal")).sendKeys("Choker with Bead");
		driver.findElement(By.xpath("//button[@aria-label='Search']//*[name()='svg']")).click();
		
		//Opening product page
		driver.findElement(By.id("CardLink--8792165515556")).click();
		
		//Add quantity
		int i;
		for(i=1;i<5;i++) 
		{
			driver.findElement(By.xpath("//button[@name='plus']")).click();
		}
		
		//click on add to cart button
		driver.findElement(By.id("ProductSubmitButton-template--18567496368420__main")).click();
		Thread.sleep(2000);
		
		
				//2. Click on Search icon
				WebElement search2 = driver.findElement(By.xpath("//summary[@aria-label='Search']//span//*[name()='svg']"));
				search2.click();
				
				driver.findElement(By.id("Search-In-Modal")).sendKeys("Choker with Gold Pendant");
				driver.findElement(By.xpath("//button[@aria-label='Search']//*[name()='svg']")).click();
				
				//Opening product page
				driver.findElement(By.id("CardLink--8792165712164")).click();
				
				//Add quantity
				int k;
				for(k=1;k<10;k++) 
				{
					driver.findElement(By.xpath("//button[@name='plus']")).click();
				}
				
				//click on add to cart button
				driver.findElement(By.id("ProductSubmitButton-template--18567496368420__main")).click();
				Thread.sleep(2000);
				
				// Removing mini cart
				driver.findElement(By.xpath("//button[@class='cart-notification__close modal__close-button link link--text focus-inset']")).click();
				Thread.sleep(2000);
				
				//selecting silver variant
				driver.findElement(By.xpath("//label[@for='template--18567496368420__main-1-1']")).click();
				Thread.sleep(2000);
				
				//Add quantity
				int j;
				for(j=1;j<10;j++) 
				{
					driver.findElement(By.xpath("//button[@name='plus']")).click();
				}
				
				
				//click on add to cart button
				driver.findElement(By.id("ProductSubmitButton-template--18567496368420__main")).click();
				Thread.sleep(2000);
				
		
		//click on view cart button
		//driver.findElement(By.id("cart-notification-button")).click();
		driver.findElement(By.xpath("//a[@id='cart-notification-button']")).click();
		
		
		//camparing prices on cart page
		   WebElement subtotal = driver.findElement(By.xpath("//p[@class='totals__subtotal-value']"));
		   String ActualsubTotal = subtotal.getText();
		   System.out.println("Actual subtotal price is: " +ActualsubTotal);
		   Thread.sleep(2000);
		   String ExpectedSubTotal="Rs. 3950.00";
		   Thread.sleep(2000);
		   
		   /**** Screenshot of cart page ******/
			 // Convert web driver object to TakeScreenshot
	    TakesScreenshot ts = (TakesScreenshot) driver;

	    // Call getScreenshotAs method to create image file
	    File source = ts.getScreenshotAs(OutputType.FILE);

	    // Copy file at destination
	    FileHandler.copy(source, new File("D:\\All Selenium Webdriver Screenshots\\OSCP CPW Live app\\All Customer\\Product_Fixed\\screenshots" + System.currentTimeMillis() + ".png"));
	    System.out.println("the Screenshot of cart page is taken");
	    
	    
		   if(ActualsubTotal.equalsIgnoreCase(ExpectedSubTotal)) 
		      { 
			   driver.findElement(By.id("checkout")).click();//Click on checkout button
			   System.out.println("Cart value assert is successful");
		      }
		   Thread.sleep(5000);
		   
		   
		   
		   /**** Screenshot of checkout page ******/
			 // Convert web driver object to TakeScreenshot
	      TakesScreenshot ts1 = (TakesScreenshot) driver;

	      // Call getScreenshotAs method to create image file
	      File source1 = ts.getScreenshotAs(OutputType.FILE);

	      // Copy file at destination
	      FileHandler.copy(source1, new File("D:\\All Selenium Webdriver Screenshots\\OSCP CPW Live app\\All Customer\\Product_Fixed\\screenshots" + System.currentTimeMillis() + ".png"));
	      System.out.println("the Screenshot of checkout page is taken");
	      
		 //camparing prices on checkout page
		   Thread.sleep(3000);
		   WebElement total = driver.findElement(By.xpath("//strong[@class='_19gi7yt0 _19gi7ytl _1fragemfs _19gi7yt1 notranslate']"));
		   String ActualTotal = total.getText();
		   System.out.println("Actual total price is: " +ActualTotal);
		   Thread.sleep(2000);
		   String ExpectedTotal="₹4,305.50";
		   Thread.sleep(3000);
		   if(ActualTotal.equalsIgnoreCase(ExpectedTotal)) 
		      { 
			   //driver.get("https://v2-cpw-test-app.myshopify.com/cart");	
			   System.out.println("Checkout assert is successful");
			   driver.get("https://v2-cpw-test-app.myshopify.com/cart");
		      }
		   Thread.sleep(3000);
		   
		   //click on empty cart button
		   driver.findElement(By.xpath("//a[@class='customcartitems btn button']")).click();
		
		   driver.close();

		
		
	

	}

}
