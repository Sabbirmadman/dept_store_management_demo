import { ChangeEvent, useRef, useState } from "react";
import { useTextRecognition } from "../hooks/useTextRecognition";

export default function InvoiceMaker() {
    const { selectedImage, recognizedText, handleImageSelection } =
        useTextRecognition();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const image = event?.target?.files?.[0] || null;
        handleImageSelection(image);
    };

    const handleCameraClick = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("Camera not supported on this device.");
            return;
        }

        try {
            setIsCameraActive(true);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
            alert("Error accessing camera. Please try again.");
        }
    };

    const captureImage = () => {
        if (videoRef.current) {
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const context = canvas.getContext("2d");
            if (context) {
                context.drawImage(
                    videoRef.current,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                const imageUrl = canvas.toDataURL("image/png");
                handleImageSelection(new File([imageUrl], "capture.png"));
                setIsCameraActive(false);
                stopCamera();
            }
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraActive(false);
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
            <h2>Invoice Text Extractor</h2>
            <div style={{ marginBottom: "20px" }}>
                <button
                    onClick={handleCameraClick}
                    style={{ marginRight: "10px" }}
                >
                    Use Camera
                </button>
                <button onClick={() => fileInputRef.current?.click()}>
                    Upload File
                </button>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                />
            </div>
            {isCameraActive && (
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <video
                        ref={videoRef}
                        style={{
                            width: "100%",
                            maxWidth: "400px",
                            border: "1px solid #ccc",
                        }}
                    />
                    <div style={{ marginTop: "10px" }}>
                        <button
                            onClick={captureImage}
                            style={{ marginRight: "10px" }}
                        >
                            Capture
                        </button>
                        <button onClick={stopCamera}>Cancel</button>
                    </div>
                </div>
            )}
            {selectedImage && (
                <div>
                    <img
                        src={selectedImage}
                        alt="Selected"
                        style={{
                            maxWidth: "100%",
                            height: "auto",
                            marginBottom: "20px",
                            border: "1px solid #ccc",
                            padding: "5px",
                        }}
                    />
                    <div>
                        <h3>Recognized Text:</h3>
                        <p
                            style={{
                                whiteSpace: "pre-wrap",
                                backgroundColor: "#f9f9f9",
                                padding: "10px",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                            }}
                        >
                            {recognizedText || "Processing..."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
