import React, { useRef, useState } from "react";
import "./ImageGenerator.css";
import defaultimage from "../Assets/defaultimage.jpg";



const ImageGenerator = () => {
  const [image_url, setImage_url] = useState("/");
  const inputRef = useRef(null);
  const [loading,setLoading] = useState(false);

  const imageGenerator = async () => {
    if (inputRef.current.value === "") {
      return 0;
    }
    setLoading(true);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            "User-Agent": "Chrome",
          },
          
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: `${inputRef.current.value}`,
            n: 1,
            size: "1024x1024",
          }),
        }
      );  

      if (!response.ok) {
        console.error(
          "API request failed:",
          response.status,
          response.statusText
        );
        return;
      }

      let data = await response.json();
      let data_array = data.data;
      setImage_url(data_array[0].url);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
    setLoading(false);
  };

  return (
    <div className="ai-image-generator">
      <div className="header">
        AI Image <span>generator</span>
      </div>
      <div className="input-container">
        <p>
          Imagine having the power to create stunning images with just a few
          words. This AI Image Generator app makes this possible !
        </p>
        <p>
          Using the cutting-edge DALL-E model, this app allows users to generate
          high-quality images based on text prompts. <span>Try it Out ! !</span>
        </p>
      </div>

      <div className="img-loading">
        <div className="image">
          <img src={image_url === "/" ? defaultimage : image_url} alt="" />
        </div>
        <div className="loading">
          <div className={loading?"loading-bar-full":"loading-bar"}></div>
          <div className={loading?"loading-text":"display-none"}>Loading....</div>
        </div>
      </div>
      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder="Describe the image you want to create"
        />
        <div
          className="generate-btn"
          onClick={() => {
            imageGenerator();
          }}
        >
          Generate image now
        </div>
       
      </div>
      <p className="terms">*Conditions Apply - Only 5 images per/min</p>
    </div>
    
  );
};

export default ImageGenerator;
