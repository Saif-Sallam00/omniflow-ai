import type { Express } from "express";
import { createServer, type Server } from "http";
import { contactFormSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = contactFormSchema.parse(req.body);
      
      console.log('Contact form submission:', {
        name: validatedData.name,
        email: validatedData.email,
        service: validatedData.service,
        message: validatedData.message.substring(0, 50) + '...',
      });

      res.json({ 
        success: true, 
        message: 'Thank you for your inquiry. We will get back to you within 24 hours.' 
      });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(400).json({ 
        success: false, 
        message: 'Invalid form data. Please check your inputs and try again.' 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
