import { useState } from 'react';
import { uploadImage, editImage, getImageUrl } from '../api/imagesApi';

const ImageManager = () => {
  const [file, setFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null); // { id, url }
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    try {
      setStatus("Laddar upp...");
      const data = await uploadImage(file);
      setUploadedImage(data);
      setStatus("Uppladdning klar!");
    } catch (error) {
      console.error(error);
      setStatus("Fel vid uppladdning");
    }
  };

  const handleEdit = async () => {
    if (!uploadedImage || !text) return;
    try {
      setStatus("Bearbetar bild...");
      await editImage(uploadedImage.id, text);
      
      // Hack: Lägg till tidstämpel för att tvinga webbläsaren att ladda om bilden
      setUploadedImage(prev => ({
        ...prev,
        url: `${prev.url.split('?')[0]}?t=${Date.now()}`
      }));
      setStatus("Bild uppdaterad!");
    } catch (error) {
      console.error(error);
      setStatus("Kunde inte redigera bild");
    }
  };

  return (
    <div className="image-manager-container" style={{ border: '1px solid #ddd', padding: '1rem', marginTop: '1rem' }}>
      <h3>Bildhantering (Läkare)</h3>
      
      {/* UPLOAD DELEN */}
      <div style={{ marginBottom: '1rem' }}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleUpload}>Ladda upp</button>
      </div>

      <p>Status: <i>{status}</i></p>

      {/* VISA BILD & REDIGERA */}
      {uploadedImage && (
        <div>
          <div style={{ marginBottom: '10px' }}>
            <input 
              type="text" 
              placeholder="Text att skriva på bilden..." 
              value={text} 
              onChange={(e) => setText(e.target.value)}
              style={{ padding: '5px', marginRight: '5px' }}
            />
            <button onClick={handleEdit}>Rita text</button>
          </div>

          <div style={{ border: '1px dashed #ccc', display: 'inline-block' }}>
            <img 
              src={getImageUrl(uploadedImage.url)} 
              alt="Patientbild" 
              style={{ maxWidth: '100%', maxHeight: '300px' }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageManager;