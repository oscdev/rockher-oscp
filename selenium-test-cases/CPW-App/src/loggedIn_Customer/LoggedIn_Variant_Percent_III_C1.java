package loggedIn_Customer;

import java.io.File;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.io.FileHandler;
import org.testng.annotations.Test;

public class LoggedIn_Variant_Percent_III_C1 
{
	@Test
	public void f() throws Exception 
	{
		System.setProperty("webdriver.gecko.driver","D:\\selenium jar & Drivers\\drivers\\firefox drivers\\geckodriver.exe");
		
		// Open browser and launch site
		WebDriver driver = new FirefoxDriver();
		driver.get("https://v2-cpw-test-app.myshopify.com/");
		driver.manage().window().maximize();
		driver.findElement(By.id("password")).sendKeys("OSC123");
		driver.findElement(By.xpath("//button[@type='submit']")).click();
		Thread.sleep(2000);
		
		//Click on login icon
		driver.findElement(By.xpath("(//a[@href='/account/login'])[2]")).click();
		
		// Click on Email & Password fields
		driver.findElement(By.id("CustomerEmail")).sendKeys("pradnya@oscprofessionals.in");
	    driver.findElement(By.id("CustomerPassword")).sendKeys("ensyspass0101");
		Thread.sleep(3000);		
		
		// Click on Sign in button
		driver.findElement(By.xpath("//button[normalize-space()='Sign in']")).click();
		Thread.sleep(3000);
		
		// Product Name-1.Guardian Angel Earrings 

				// Click on search icon
				driver.findElement(By.xpath("//summary[@aria-label='Search']")).click();
				
				// Click on search bar and put the data
				driver.findElement(By.id("Search-In-Modal")).sendKeys("Guardian Angel Earrings");
				driver.findElement(By.xpath("//button[@class='search__button field__button']")).click();
				
				// Go to product page
				driver.findElement(By.id("CardLink--8792166957348")).click();
				
				//Add quantity
				int i;
				for(i=1;i<=2;i++) 
				{
					driver.findElement(By.name("plus")).click();
				}
				
		        // Screenshot of product page //
				
			    // Convert web driver object to TakeScreenshot
			    TakesScreenshot ts = (TakesScreenshot) driver;

			    // Call getScreenshotAs method to create image file
			    File source = ts.getScreenshotAs(OutputType.FILE);

			    // Copy file at destination
			    FileHandler.copy(source, new File("D:\\All Selenium Webdriver Screenshots\\OSCP CPW Live app\\LoggedIn Customer\\Variant-Percent\\Screenshots" 
			                                                   + System.currentTimeMillis() + ".png"));
			    System.out.println("The Screenshot of Product Page is taken");
				
				//click on add to cart button
				driver.findElement(By.id("ProductSubmitButton-template--18567496368420__main")).click();
				Thread.sleep(2000);

				// Product Name-2.Zulu [Red]

				// Click on search icon
				driver.findElement(By.xpath("//summary[@aria-label='Search']")).click();
				
				// Click on search bar and put the data
				driver.findElement(By.id("Search-In-Modal")).sendKeys("Zulu ");
				driver.findElement(By.xpath("//button[@class='search__button field__button']")).click();
				
				// Go to product page
				driver.findElement(By.id("CardLink--8840751120676")).click();
				
				//Add quantity
				int j;
				for(j=1;j<=2;j++) 
				{
					driver.findElement(By.name("plus")).click();
				}
				
		        // Screenshot of product page //
				
			    // Convert web driver object to TakeScreenshot
			    TakesScreenshot x = (TakesScreenshot) driver;

			    // Call getScreenshotAs method to create image file
			    File source5 = x.getScreenshotAs(OutputType.FILE);

			    // Copy file at destination
			    FileHandler.copy(source5, new File("D:\\All Selenium Webdriver Screenshots\\OSCP CPW Live app\\LoggedIn Customer\\Variant-Percent\\Screenshots" 
			                                                   + System.currentTimeMillis() + ".png"));
			    System.out.println("The Screenshot of Product Page is taken");
				
				//click on add to cart button
				driver.findElement(By.id("ProductSubmitButton-template--18567496368420__main")).click();
				Thread.sleep(2000);
				
				// Product Name-3.Zulu [Black]

				// Click on Remove icon of mini cart 
				driver.findElement(By.xpath("//button[@class='cart-notification__close modal__close-button link link--text focus-inset']")).click();
				Thread.sleep(3000);
				
				// Click on Black Color Label
				driver.findElement(By.xpath("//label[@for='template--18567496368420__main-1-1']")).click();
				Thread.sleep(2000);
				
		        // Screenshot of product page //
				
			    // Convert web driver object to TakeScreenshot
			    TakesScreenshot y = (TakesScreenshot) driver;

			    // Call getScreenshotAs method to create image file
			    File source4 = y.getScreenshotAs(OutputType.FILE);

			    // Copy file at destination
			    FileHandler.copy(source4, new File("D:\\All Selenium Webdriver Screenshots\\OSCP CPW Live app\\LoggedIn Customer\\Variant-Percent\\Screenshots" 
			                                                   + System.currentTimeMillis() + ".png"));
			    System.out.println("The Screenshot of Product Page is taken");
				
				//click on add to cart button
				driver.findElement(By.id("ProductSubmitButton-template--18567496368420__main")).click();
				Thread.sleep(2000);
				
				// Click on view cart button
				driver.findElement(By.id("cart-notification-button")).click();
				Thread.sleep(5000);
				
				//Add quantity - 10 (Guardian Angel Earrings)
						for(i=1;i<=7;i++) 
						{
							driver.findElement(By.xpath("(//button[@class='quantity__button no-js-hidden'])[3]")).click();
						}
						Thread.sleep(2000);
						
						//Add quantity - 10 Zulu Red  (Offer applied)
						for(i=1;i<=7;i++) 
						{
							driver.findElement(By.xpath("(//button[@class='quantity__button no-js-hidden'])[5]")).click();
						}
						Thread.sleep(2000);
				
						//scroll page
						JavascriptExecutor js = (JavascriptExecutor) driver;
					    js.executeScript("window.scrollBy(0,320)", "");
					    
				// Comparing prices on cart page
				WebElement subtotal = driver.findElement(By.xpath("//p[@class='totals__subtotal-value']"));
				String ActualsubTotal = subtotal.getText();
			    System.out.println("Actual subtotal price is: " +ActualsubTotal);
				Thread.sleep(2000);
				
				String ExpectedSubTotal="Rs. 4658.00";
				Thread.sleep(2000);
				   
				// Screenshot of cart page //
			    // Convert web driver object to TakeScreenshot
			    TakesScreenshot ts1 = (TakesScreenshot) driver;
			    // Call getScreenshotAs method to create image file
			    File source1 = ts1.getScreenshotAs(OutputType.FILE);
			    // Copy file at destination
			    FileHandler.copy(source1, new File("D:\\All Selenium Webdriver Screenshots\\OSCP CPW Live app\\LoggedIn Customer\\Variant-Percent\\Screenshots" 
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
				
				String ExpectedTotal1="Rs. 4658.00";
			    Thread.sleep(2000);
			
			    
			    // Including Tax
				WebElement total2 = driver.findElement(By.xpath("//strong[@class='_19gi7yt0 _19gi7ytl _1fragemfs _19gi7yt1 notranslate']"));
				String ActualTotal2 = total2.getText();
				System.out.println("Actual Total price on Checkout is: " +ActualTotal2);
				Thread.sleep(2000);
				
				String ExpectedTotal3="₹5,077.22";
			    Thread.sleep(2000);
			  

				// Screenshot of checkout page //
				 
				// Convert web driver object to TakeScreenshot
			    TakesScreenshot ts2 = (TakesScreenshot) driver;

			    // Call getScreenshotAs method to create image file
			    File source2 = ts2.getScreenshotAs(OutputType.FILE);

			    // Copy file at destination
			    FileHandler.copy(source2, new File("D:\\All Selenium Webdriver Screenshots\\OSCP CPW Live app\\LoggedIn Customer\\Variant-Percent\\Screenshots" + System.currentTimeMillis() + ".png"));
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
