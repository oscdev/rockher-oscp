package Tagged_Customer;
import java.io.File;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.io.FileHandler;
import org.testng.annotations.Test;

public class CTag_Collection_fixed_C2 
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
		
		// Click on login icon
		//driver.findElement(By.xpath("(//a[@href='/account/login'])[2]")).click();
		driver.get("https://cpw-app-v4.myshopify.com/account");
		
		// Click on Email & Password fields
		driver.findElement(By.id("CustomerEmail")).sendKeys("sakshi@oscprofessionals.in");
		driver.findElement(By.id("CustomerPassword")).sendKeys("ensyspass0101");
		
		// Click on Sign in button
		driver.findElement(By.xpath("//button[normalize-space()='Sign in']")).click();

		// Click on search icon
		driver.findElement(By.xpath("//summary[@aria-label='Search']")).click();
		
		// Click on search bar and put the data
		// "Product Name - #54 FemPause 60 vegcaps
		driver.findElement(By.id("Search-In-Modal")).sendKeys("#54 FemPause 60 vegcaps");
		driver.findElement(By.xpath("//button[@class='search__button field__button']")).click();
		
		// Go to product page
		driver.findElement(By.id("CardLink--8811933139228")).click();

		// Screenshot of product page //
		
	    // Convert web driver object to TakeScreenshot
	    TakesScreenshot ts = (TakesScreenshot) driver;

	    // Call getScreenshotAs method to create image file
	    File source = ts.getScreenshotAs(OutputType.FILE);

	    // Copy file at destination
	    FileHandler.copy(source, new File("D:\\All Selenium Webdriver Screenshots\\CPW Dev Testing\\III_Tagged_Customer\\Collection-fixed\\Screenshots"+System.currentTimeMillis()+".png"));
	    System.out.println("The Screenshot of Product Page is taken");
	    
		//Add quantity - 1
	    
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
		
		String ExpectedSubTotal="Rs. 130.00";
		Thread.sleep(2000);
		   
		// Screenshot of cart page //
		
	    // Convert web driver object to TakeScreenshot
	    TakesScreenshot ts1 = (TakesScreenshot) driver;

	    // Call getScreenshotAs method to create image file
	    File source1 = ts1.getScreenshotAs(OutputType.FILE);

	    // Copy file at destination
	    FileHandler.copy(source1, new File("D:\\All Selenium Webdriver Screenshots\\CPW Dev Testing\\III_Tagged_Customer\\Collection-fixed\\Screenshots"+System.currentTimeMillis()+".png"));
	    System.out.println("The Screenshot of Shopping-Cart Page is taken");
	    Thread.sleep(2000);
	    
	    if(ActualsubTotal.equalsIgnoreCase(ExpectedSubTotal))
	    {
			//Add quantity - 5
			int i;
			for(i=1;i<=2;i++) 
			{
				driver.findElement(By.name("plus")).click();
			}
			Thread.sleep(10000);
						
			// Comparing prices on cart page
			WebElement subtotal1 = driver.findElement(By.xpath("(//span[@class='price price--end'])[2]"));
			String ActualsubTotal1 = subtotal1.getText();
		    System.out.println("Actual subtotal price is: " +ActualsubTotal1);
			Thread.sleep(2000);
			
			String ExpectedSubTotal1="Rs. 375.00";
			Thread.sleep(2000);
			   
			// Screenshot of cart page //
			
		    // Convert web driver object to TakeScreenshot
		    TakesScreenshot ts2 = (TakesScreenshot) driver;

		    // Call getScreenshotAs method to create image file
		    File source2 = ts2.getScreenshotAs(OutputType.FILE);

		    // Copy file at destination
		    FileHandler.copy(source2, new File("D:\\All Selenium Webdriver Screenshots\\CPW Dev Testing\\III_Tagged_Customer\\Collection-fixed\\Screenshots"+System.currentTimeMillis()+".png"));
		    System.out.println("The Screenshot of Shopping-Cart Page is taken");
		    Thread.sleep(2000);
	    
	              if(ActualsubTotal1.equalsIgnoreCase(ExpectedSubTotal1))
	              {
	      			//Add quantity - 10

	      			for(i=1;i<=7;i++) 
	      			{
	      				driver.findElement(By.name("plus")).click();
	      			}
	      			Thread.sleep(2000);
	      			
	      			// Comparing prices on cart page
	      			WebElement subtotal2 = driver.findElement(By.xpath("(//span[@class='price price--end'])[2]"));
	      			String ActualsubTotal2 = subtotal2.getText();
	      		    System.out.println("Actual subtotal price is: " +ActualsubTotal2);
	      			Thread.sleep(2000);
	      			
	      			String ExpectedSubTotal2="Rs. 1100.00";
	      			Thread.sleep(2000);
	      			   
	      			// Screenshot of cart page //
	      			
	      		    // Convert web driver object to TakeScreenshot
	      		    TakesScreenshot ts3 = (TakesScreenshot) driver;

	      		    // Call getScreenshotAs method to create image file
	      		    File source3 = ts3.getScreenshotAs(OutputType.FILE);

	      		    // Copy file at destination
	      		    FileHandler.copy(source3, new File("D:\\All Selenium Webdriver Screenshots\\CPW Dev Testing\\III_Tagged_Customer\\Collection-fixed\\Screenshots"+System.currentTimeMillis()+".png"));
	      		    System.out.println("The Screenshot of Shopping-Cart Page is taken");
	      		    Thread.sleep(5000);
	              
	     if(ActualsubTotal2.equalsIgnoreCase(ExpectedSubTotal2)) 
		      { 
			         // Click on Checkout button
			         driver.findElement(By.id("checkout")).click();
		      }
		Thread.sleep(10000);
	   	    
	    // Comparing prices on checkout page
	    // Without including Tax 
		WebElement Subtotal3 = driver.findElement(By.xpath("//span[@class='_19gi7yt0 _19gi7yth _1fragemfq _19gi7yt1 notranslate']"));
		String Actual_SubTotal_3 = Subtotal3.getText();
		System.out.println("Actual Subtotal price is: " +Actual_SubTotal_3);
		Thread.sleep(2000);
		
		String Expected_Total_3="₹1,100.00";
	    Thread.sleep(2000);
	    
	    // Including Tax
		WebElement total3 = driver.findElement(By.xpath("//strong[@class='_19gi7yt0 _19gi7ytl _1fragemfs _19gi7yt1 notranslate']"));
		String Actual_Total3 = total3.getText();
		System.out.println("Actual Total price is: " +Actual_Total3);
		Thread.sleep(2000);
		
		String Expected_Total3="₹1,199.00";
	    Thread.sleep(2000);
	    
		// Screenshot of checkout page //
		 
		// Convert web driver object to TakeScreenshot
	    TakesScreenshot ts4 = (TakesScreenshot) driver;

	    // Call getScreenshotAs method to create image file
	    File source4 = ts4.getScreenshotAs(OutputType.FILE);

	    // Copy file at destination
	    FileHandler.copy(source4, new File("D:\\All Selenium Webdriver Screenshots\\CPW Dev Testing\\III_Tagged_Customer\\Collection-fixed\\Screenshots"+System.currentTimeMillis()+".png"));
	    System.out.println("The Screenshot of Checkout Page is taken");
		Thread.sleep(2000);
		   
	    if(Actual_Total3.equalsIgnoreCase(Expected_Total3)) 
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


}
