import { useState } from "react";
import Tesseract from "tesseract.js";

export const useTextRecognition = () => {
    const [recognizedText, setRecognizedText] = useState<string>("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleTextRecognition = async (image: string) => {
        if (!image) {
            setError("Please upload an image first.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { data } = await Tesseract.recognize(image, "eng", {
                logger: (info) => console.log(info),
            });

            const detectedText = data.text.trim();
            const numberMatches = detectedText.match(/\d+/g); // Extract all numbers
            setRecognizedText(
                numberMatches ? numberMatches.join(", ") : "No numbers found."
            );
        } catch (err) {
            console.error("OCR Error:", err);
            setError("Error during text recognition.");
        } finally {
            setIsLoading(false);
        }

        if (image) {
            try {
                const {
                    data: { text },
                } = await Tesseract.recognize(image);
                setRecognizedText(text);
            } catch (error) {
                console.error("Error recognizing text:", error);
                setRecognizedText("Error recognizing text. Please try again.");
            }
        }
    };

    const handleImageSelection = (imageFile: File | null) => {
        const imageUrl = imageFile ? URL.createObjectURL(imageFile) : null;
        setSelectedImage(imageUrl);
        setRecognizedText("");
        if (imageUrl) {
            handleTextRecognition(imageUrl);
        }
    };

    return {
        selectedImage,
        recognizedText,
        handleImageSelection,
        isLoading,
        error,
    };
};
