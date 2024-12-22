import axios from "axios";

class ApiService {
  constructor(baseURL) {
    this.api = axios.create({
      baseURL: baseURL,
    });

    this.parserServer = axios.create({
      baseURL: "http://localhost:3001/",
      headers: { "Content-Type": "application/json" },
    });
  }

  async get(url, params = {}) {
    try {
      const response = await this.api.get(url, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async post(url, data) {
    try {
      const response = await this.api.post(url, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async put(url, data) {
    try {
      const response = await this.api.put(url, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(url) {
    try {
      const response = await this.api.delete(url);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async patch(id, updateData) {
    try {
      const response = await this.api.patch(`files/${id}`, updateData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    console.error("API ERROR: ", error);
    throw error;
  }

  async executeCode(code) {
    const data = { expression: code };
    try {
      const response = await this.parserServer.post("/exec", data);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("API ERROR:", error);
      this.handleError(error);
    }
  }
}

export default ApiService;
