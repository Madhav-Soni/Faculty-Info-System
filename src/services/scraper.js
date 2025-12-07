// src/services/scraper.js
import { bulkUpsertFaculty, logScrape, getAllDepartments } from './database.js';

// Example scraper - adapt to your college website structure
export async function scrapeFacultyData(url) {
  let scrapedCount = 0;
  let status = 'success';
  let errorMsg = null;

  try {
    // Fetch the webpage
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Parse HTML (you'll need to adjust selectors based on your website)
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Example: Extract faculty cards/rows
    const facultyElements = doc.querySelectorAll('.faculty-card'); // Adjust selector
    const facultyData = [];
    
    for (const element of facultyElements) {
      try {
        const faculty = {
          name: element.querySelector('.faculty-name')?.textContent.trim() || '',
          designation: element.querySelector('.designation')?.textContent.trim() || '',
          qualification: element.querySelector('.qualification')?.textContent.trim() || '',
          email: element.querySelector('.email')?.textContent.trim() || '',
          phone: element.querySelector('.phone')?.textContent.trim() || '',
          profile_link: element.querySelector('a')?.href || '',
          // You'll need to map department names to IDs
          department_id: await getDepartmentIdByName(
            element.querySelector('.department')?.textContent.trim()
          )
        };
        
        if (faculty.email) { // Only add if email exists (unique identifier)
          facultyData.push(faculty);
        }
      } catch (err) {
        console.error('Error parsing faculty element:', err);
      }
    }
    
    // Bulk insert/update into database
    if (facultyData.length > 0) {
      await bulkUpsertFaculty(facultyData);
      scrapedCount = facultyData.length;
    }
    
  } catch (error) {
    console.error('Scraping error:', error);
    status = 'failed';
    errorMsg = error.message;
  }
  
  // Log the scrape operation
  await logScrape(scrapedCount, status, errorMsg);
  
  return {
    success: status === 'success',
    count: scrapedCount,
    error: errorMsg
  };
}

// Helper function to get department ID by name
async function getDepartmentIdByName(departmentName) {
  if (!departmentName) return null;
  
  const departments = await getAllDepartments();
  const dept = departments.find(
    d => d.department_name.toLowerCase() === departmentName.toLowerCase()
  );
  
  return dept?.department_id || null;
}

// Alternative: Use Puppeteer for JavaScript-heavy sites
export async function scrapeWithPuppeteer(url) {
  // Note: Puppeteer requires backend environment (Node.js)
  // Install: npm install puppeteer
  
  /* Example implementation:
  const puppeteer = require('puppeteer');
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });
  
  const facultyData = await page.evaluate(() => {
    const faculty = [];
    document.querySelectorAll('.faculty-card').forEach(card => {
      faculty.push({
        name: card.querySelector('.name')?.textContent,
        email: card.querySelector('.email')?.textContent,
        // ... other fields
      });
    });
    return faculty;
  });
  
  await browser.close();
  return facultyData;
  */
}

// Parse and clean faculty data
export function cleanFacultyData(rawData) {
  return {
    name: rawData.name?.trim().replace(/\s+/g, ' ') || '',
    designation: rawData.designation?.trim() || '',
    qualification: rawData.qualification?.trim() || '',
    email: rawData.email?.toLowerCase().trim() || '',
    phone: rawData.phone?.replace(/\D/g, '').trim() || '',
    profile_link: rawData.profile_link?.trim() || '',
    department_id: rawData.department_id || null
  };
}