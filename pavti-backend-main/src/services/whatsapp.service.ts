import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import dotenv from "dotenv";
dotenv.config();

export class WhatsAppService {
  private static instance: WhatsAppService;
  private readonly apiVersion = "v17.0";
  private readonly baseUrl: string;
  private readonly accessToken: string;
  private readonly phoneNumberId: string;

  private constructor() {
    // These should be loaded from environment variables
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || "";
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;

    if (!this.accessToken || !this.phoneNumberId) {
      throw new Error(
        "WhatsApp configuration is missing. Please set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID environment variables."
      );
    }
  }

  public static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService();
    }
    return WhatsAppService.instance;
  }

  public async waitForClientReady(): Promise<void> {
    // No need to wait for client ready with the Cloud API
    return Promise.resolve();
  }

  public async sendMedia(chatId: string, filePath: string): Promise<string> {
    try {
      // First, upload the media to get a media ID
      const formData = new FormData();
      formData.append("file", fs.createReadStream(filePath));
      formData.append("type", "image/png");
      formData.append("messaging_product", "whatsapp");

      const uploadResponse = await axios.post(
        `${this.baseUrl}/${this.phoneNumberId}/media`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            ...formData.getHeaders(),
          },
        }
      );

      const mediaId = uploadResponse.data.id;
      const formattedPhoneNumber = chatId.replace(/[^0-9]/g, "");

      // Then send the message with the media
      const messageResponse = await axios.post(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: formattedPhoneNumber,
          type: "image",
          image: {
            id: mediaId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return messageResponse.data.messages[0].id;
    } catch (error) {
      console.error("Error sending media:", error);
      throw error;
    }
  }

  // public async sendMessage(chatId: string, message: string): Promise<void> {
  //   try {
  //     return await axios.post(
  //       `${this.baseUrl}/${this.phoneNumberId}/messages`,
  //       {
  //         messaging_product: "whatsapp",
  //         recipient_type: "individual",
  //         to: chatId.replace("@c.us", ""),
  //         type: "text",
  //         text: {
  //           body: message,
  //         },
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${this.accessToken}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //     throw error;
  //   }
  // }

 public async sendMessage(chatId: string, message: string): Promise<string> {
  try {
    const response = await axios.post(
      `${this.baseUrl}/${this.phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: chatId.replace("@c.us", ""),
        type: "text",
        text: {
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ Return only the message ID as a string
    return response.data.messages[0].id;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}


}
