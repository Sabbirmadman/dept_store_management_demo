import React, { useState, useRef, useCallback } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

const ObjectDetector: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [detectedRegions, setDetectedRegions] = useState<
        Array<{ class: string; croppedImage: string }>
    >([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const handleImageUpload = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                const imageUrl = URL.createObjectURL(file);
                setImage(imageUrl);
                setDetectedRegions([]);
                setError(null);
            }
        },
        []
    );

    const detectObjects = useCallback(async () => {
        if (!imageRef.current || !canvasRef.current) {
            setError("Please upload an image first.");
            return;
        }

        try {
            setIsLoading(true);
            const model = await cocoSsd.load();
            const predictions = await model.detect(imageRef.current);

            if (predictions.length === 0) {
                setError("No objects detected.");
                return;
            }

            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            if (context && imageRef.current) {
                canvas.width = imageRef.current.width;
                canvas.height = imageRef.current.height;

                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(
                    imageRef.current,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                const regions: Array<{ class: string; croppedImage: string }> =
                    [];

                predictions.forEach(({ bbox, class: className, score }) => {
                    const [x, y, width, height] = bbox;

                    // Draw bounding box
                    context.strokeStyle = "red";
                    context.lineWidth = 2;
                    context.strokeRect(x, y, width, height);
                    context.font = "16px Arial";
                    context.fillStyle = "red";
                    context.fillText(
                        `${className} (${(score * 100).toFixed(2)}%)`,
                        x,
                        y - 5
                    );

                    // Create cropped image using correctly scaled coordinates
                    const scaleX =
                        imageRef.current.naturalWidth / imageRef.current.width;
                    const scaleY =
                        imageRef.current.naturalHeight /
                        imageRef.current.height;

                    const croppedCanvas = document.createElement("canvas");
                    const croppedContext = croppedCanvas.getContext("2d");
                    const scaledX = x * scaleX;
                    const scaledY = y * scaleY;
                    const scaledWidth = width * scaleX;
                    const scaledHeight = height * scaleY;

                    croppedCanvas.width = scaledWidth;
                    croppedCanvas.height = scaledHeight;

                    if (croppedContext) {
                        croppedContext.drawImage(
                            imageRef.current,
                            scaledX,
                            scaledY,
                            scaledWidth,
                            scaledHeight,
                            0,
                            0,
                            scaledWidth,
                            scaledHeight
                        );
                        const croppedImage = croppedCanvas.toDataURL();
                        regions.push({ class: className, croppedImage });
                    }
                });

                setDetectedRegions(regions);
            }
        } catch (err) {
            console.error("Detection Error:", err);
            setError("An error occurred during detection. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
            <h2>AI Object Detector</h2>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ marginBottom: "20px" }}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            {image && (
                <div
                    style={{
                        display: "flex",
                        gap: "20px",
                        marginBottom: "20px",
                    }}
                >
                    <div>
                        <h3>Uploaded Image</h3>
                        <img
                            ref={imageRef}
                            src={image}
                            alt="Uploaded"
                            style={{
                                maxWidth: "100%",
                                border: "1px solid #ccc",
                            }}
                        />
                    </div>
                    <div>
                        <h3>Processed Image</h3>
                        <canvas
                            ref={canvasRef}
                            style={{ border: "1px solid #ccc" }}
                        />
                    </div>
                </div>
            )}
            {image && (
                <button
                    onClick={detectObjects}
                    disabled={isLoading}
                    style={{ marginBottom: "20px" }}
                >
                    {isLoading ? "Processing..." : "Detect Objects"}
                </button>
            )}
            {detectedRegions.length > 0 && (
                <div>
                    <h3>Detected Regions</h3>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "20px",
                        }}
                    >
                        {detectedRegions.map((region, index) => (
                            <div
                                key={index}
                                style={{
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    padding: "10px",
                                    textAlign: "center",
                                }}
                            >
                                <img
                                    src={region.croppedImage}
                                    alt={`Detected: ${region.class}`}
                                    style={{
                                        maxWidth: "100%",
                                        marginBottom: "10px",
                                    }}
                                />
                                <p>
                                    <strong>{region.class}</strong>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ObjectDetector;
