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

public class C_Tag_Product_Percent_I_C2 
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
				driver.findElement(By.id("CustomerEmail")).sendKeys("sakshi@oscprofessionals.in");
				driver.findElement(By.id("CustomerPassword")).sendKeys("ensyspass0101");
				
				// Click on Sign in button
				driver.findElement(By.xpath("//button[normalize-space()='Sign in']")).click();

		// Click on search icon
		driver.findElement(By.xpath("//summary[@aria-label='Search']")).click();
		
		// Click on search bar and put the data
		driver.findElement(By.id("Search-In-Modal")).sendKeys("Gold Bird Necklace");
		driver.findElement(By.xpath("//button[@class='search__button field__button']")).click();
		
		// Go to product page
				driver.findElement(By.id("CardLink--8786366202140")).click();
				Thread.sleep(3000);
				
				// Screenshot of product page //
			    // Convert web driver object to TakeScreenshot
			    TakesScreenshot ts = (TakesScreenshot) driver;
			    // Call getScreenshotAs method to create image file
			    File source = ts.getScreenshotAs(OutputType.FILE);
			    // Copy file at destination
			    FileHandler.copy(source, new File("D:\\All Selenium Webdriver Screenshots\\CPW Dev Testing\\III_Tagged_Customer\\Product-Percent\\Screenshots" 
			                                                   + System.currentTimeMillis() + ".png"));
			    System.out.println("The Screenshot of Product Page is taken");
				
				//Add quantity -2
				int i;
				for(i=1;i<=1;i++) 
				{
					driver.findElement(By.name("plus")).click();
				}
				
				//click on add to cart button
				driver.findElement(By.id("ProductSubmitButton-template--20808972271900__main")).click();
				Thread.sleep(2000);

				
				// Click on view cart button
				driver.findElement(By.id("cart-notification-button")).click();
				
				// Comparing prices on cart page
				WebElement subtotal = driver.findElement(By.xpath("(//span[@class='price price--end'])[2]"));
				String ActualsubTotal = subtotal.getText();
			    System.out.println("Actual subtotal price is: " +ActualsubTotal);
				Thread.sleep(2000);
				
				String ExpectedSubTotal="Rs. 150.10";
				Thread.sleep(2000);
				
				// Screenshot of cart page //
			    // Convert web driver object to TakeScreenshot
			    TakesScreenshot ts1 = (TakesScreenshot) driver;
			    // Call getScreenshotAs method to create image file
			    File source1 = ts1.getScreenshotAs(OutputType.FILE);
			    // Copy file at destination
			    FileHandler.copy(source1, new File("D:\\All Selenium Webdriver Screenshots\\CPW Dev Testing\\III_Tagged_Customer\\Product-Percent\\Screenshots" 
			                                                   + System.currentTimeMillis() + ".png"));
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
					
					String ExpectedSubTotal1="Rs. 363.40";
					Thread.sleep(2000);
					
					// Screenshot of cart page //
				    // Convert web driver object to TakeScreenshot
				    TakesScreenshot ts2 = (TakesScreenshot) driver;
				    // Call getScreenshotAs method to create image file
				    File source2 = ts2.getScreenshotAs(OutputType.FILE);
				    // Copy file at destination
				    FileHandler.copy(source2, new File("D:\\All Selenium Webdriver Screenshots\\CPW Dev Testing\\III_Tagged_Customer\\Product-Percent\\Screenshots" 
				                                                  + System.currentTimeMillis() + ".png"));
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
		    			
		  			driver.navigate().refresh();
		  			
		  		// Comparing prices on cart page
		  					WebElement subtotal2 = driver.findElement(By.xpath("(//span[@class='price price--end'])[2]"));
		  					String ActualsubTotal2 = subtotal2.getText();
		  				    System.out.println("Actual subtotal price is: " +ActualsubTotal1);
		  					Thread.sleep(2000);
		  					
		  					String ExpectedSubTotal2="Rs. 711.00";
		  					Thread.sleep(2000);
		  					
		  					// Screenshot of cart page //
		  				    // Convert web driver object to TakeScreenshot
		  				    TakesScreenshot ts3 = (TakesScreenshot) driver;
		  				    // Call getScreenshotAs method to create image file
		  				    File source3 = ts3.getScreenshotAs(OutputType.FILE);
		  				    // Copy file at destination
		  				    FileHandler.copy(source3, new File("D:\\All Selenium Webdriver Screenshots\\CPW Dev Testing\\III_Tagged_Customer\\Product-Percent\\Screenshots" 
		  				                                                   + System.currentTimeMillis() + ".png"));
		  				    System.out.println("The Screenshot of Shopping-Cart Page is taken");
		  				    Thread.sleep(2000);
		  			
		  				   if(ActualsubTotal2.equalsIgnoreCase(ExpectedSubTotal2)) 
		  			      { 
		  				         // Click on Checkout button
		  				         driver.findElement(By.id("checkout")).click();
		  			      }
				      }
				Thread.sleep(10000);
			
				// Comparing prices on checkout page
			    // Without including Tax 
				WebElement Subtotal1 = driver.findElement(By.xpath("//span[@class='_19gi7yt0 _19gi7yth _1fragemfq _19gi7yt1 notranslate']"));
				String ActualSubTotal1 = Subtotal1.getText();
				System.out.println("Actual Subtotal price on Checkout is: " +ActualSubTotal1);
				Thread.sleep(2000);
				
				String ExpectedTotal1="₹711.00";
			    Thread.sleep(2000);
			    
			    // Including Tax
				WebElement total2 = driver.findElement(By.xpath("//strong[@class='_19gi7yt0 _19gi7ytl _1fragemfs _19gi7yt1 notranslate']"));
				String ActualTotal2 = total2.getText();
				System.out.println("Actual Total price on Checkout is: " +ActualTotal2);
				Thread.sleep(2000);
				
				String ExpectedTotal3="₹774.99";
			    Thread.sleep(2000);
			    
				// Screenshot of checkout page 
				// Convert web driver object to TakeScreenshot
			    TakesScreenshot ts4 = (TakesScreenshot) driver;

			    // Call getScreenshotAs method to create image file
			    File source4 = ts4.getScreenshotAs(OutputType.FILE);

			    // Copy file at destination
			    FileHandler.copy(source4, new File("D:\\All Selenium Webdriver Screenshots\\CPW Dev Testing\\III_Tagged_Customer\\Product-Percent\\Screenshots"+System.currentTimeMillis()+".png"));
			    System.out.println("The Screenshot of Checkout Page is taken");
				Thread.sleep(2000);
			  
			    if(ActualTotal2.equalsIgnoreCase(ExpectedTotal3)) 
			      { 
		  	      // Navigate back to Shopping Cart page 
		  	      driver.navigate().back();
			      }
		         Thread.sleep(2000);
				
		     	//click on delete icon
		     	driver.findElement(By.xpath("//a[@class='button button--tertiary']")).click();
		     	Thread.sleep(3000);
		     	
		     	// Click on login icon
		     	//driver.findElement(By.xpath("//a[@class='header__icon header__icon--account link focus-inset small-hide']")).click();
		     	driver.get("https://cpw-app-v4.myshopify.com/account");

		     	// Click on Log out link
		     	driver.findElement(By.xpath("//a[@href='/account/logout']")).click();
		     	Thread.sleep(3000);
		       System.out.println("Successfully Logout");

		     	driver.close();
		     		
		     	}

		 }
	}

