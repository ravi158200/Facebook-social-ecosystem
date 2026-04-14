import { useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Image, Video, Smile, Camera, X } from 'lucide-react';
import axios from 'axios';

const CreatePost = ({ onPostCreated }) => {
  const { user, token } = useContext(AuthContext);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [feeling, setFeeling] = useState("");
  const [showFeelings, setShowFeelings] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const feelingsList = ["happy", "sad", "excited", "blessed", "loved", "angry"];

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Could not access camera/microphone");
      setShowCamera(false);
    }
  };

  const startRecording = () => {
    const stream = videoRef.current.srcObject;
    if (!stream) return;

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const file = new File([blob], `video_${Date.now()}.webm`, { type: 'video/webm' });
      setVideoFile(file);
      setIsLive(true);
      stopCamera();
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
        setImage(file);
        stopCamera();
      }, 'image/jpeg');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const [isLoading, setIsLoading] = useState(false);

  const handlePost = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      let picturePath = "";
      let videoPath = "";

      if (image) {
        const formData = new FormData();
        formData.append("picture", image);
        const res = await axios.post('http://localhost:5000/api/upload', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        picturePath = res.data.filename;
      }

      if (videoFile) {
        const formData = new FormData();
        formData.append("picture", videoFile);
        const res = await axios.post('http://localhost:5000/api/upload', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        videoPath = res.data.filename;
      }

      await axios.post('http://localhost:5000/api/posts', {
        userId: user._id,
        description: `${feeling ? `is feeling ${feeling}: ` : ""}${description}`,
        picturePath,
        videoPath,
        isLive
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDescription('');
      setImage(null);
      setVideoFile(null);
      setIsLive(false);
      setFeeling("");
      if (onPostCreated) onPostCreated();
      alert("Success! Your post has been shared.");
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || err.message || "Post failed";
      alert(`Post failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 w-full relative border border-gray-100 mb-2">
      {showCamera && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl overflow-hidden w-full max-w-lg relative">
            <button onClick={stopCamera} className="absolute top-4 right-4 bg-gray-200 p-2 rounded-full z-10 hover:bg-gray-300">
               <X size={20} />
            </button>
            <div className="p-4 bg-gray-50 border-b border-gray-200">
               <h3 className="font-bold text-lg">Live Video Recorder</h3>
               {isRecording && <div className="flex items-center gap-2 text-red-600 text-sm font-bold animate-pulse"><div className="w-2 h-2 bg-red-600 rounded-full" /> REC</div>}
            </div>
            <div className="relative aspect-video bg-black">
               <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
               <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="p-4 flex flex-col gap-3">
               {!isRecording ? (
                  <div className="flex gap-2">
                     <button onClick={startRecording} className="flex-1 bg-red-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700">
                        <Video size={20} /> Start Recording
                     </button>
                     <button onClick={capturePhoto} className="flex-1 bg-facebookBlue text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2">
                        <Camera size={20} /> Take Photo
                     </button>
                  </div>
               ) : (
                  <button onClick={stopRecording} className="w-full bg-gray-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 animate-pulse">
                     <div className="w-4 h-4 bg-red-600" /> Stop & Save Video
                  </button>
               )}
               <button onClick={stopCamera} className="w-full bg-gray-200 font-bold py-2 rounded-lg text-sm">Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <img src={user.profilePicture ? `http://localhost:5000/assets/${user.profilePicture}` : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
        <div className="flex-1">
          <button 
            onClick={() => {/* could open modal here if preferred */}}
            className="w-full text-left bg-gray-100 rounded-full py-2 px-4 text-[17px] text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            What's on your mind, {user.firstName}?
          </button>
          
          <div className="mt-4">
            <input 
              type="text" 
              placeholder="Add more details..." 
              className="w-full bg-transparent outline-none text-[15px] px-2 hidden lg:block"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </div>

      {image && <div className="mb-4 relative group">
         <img src={image instanceof File ? URL.createObjectURL(image) : `http://localhost:5000/assets/${image}`} alt="upload preview" className="w-full rounded-xl border border-gray-100 shadow-sm" />
         <button className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all" onClick={() => setImage(null)}><X size={16} /></button>
      </div>}

      {videoFile && (
        <div className="mb-4 relative group">
           <video src={URL.createObjectURL(videoFile)} controls className="w-full rounded-xl bg-black max-h-[400px]" />
           <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">Live Recorded</div>
           <button className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all" onClick={() => setVideoFile(null)}><X size={16} /></button>
        </div>
      )}
      
      {showFeelings && (
        <div className="absolute bottom-20 left-0 right-0 bg-white border border-gray-100 shadow-2xl rounded-2xl p-6 z-20 flex flex-wrap gap-3 animate-in fade-in zoom-in-95">
           <div className="w-full flex justify-between items-center mb-2">
              <h3 className="text-[17px] font-bold text-gray-900">How are you feeling?</h3>
              <button onClick={() => setShowFeelings(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
           </div>
           {feelingsList.map(f => (
             <button key={f} onClick={() => {setFeeling(f); setShowFeelings(false);}} className="capitalize bg-gray-50 px-5 py-2 rounded-xl text-[14px] font-bold text-gray-600 hover:bg-facebookBlue hover:text-white transition-all shadow-sm">{f}</button>
           ))}
        </div>
      )}

      <hr className="mb-2 border-gray-100" />
      
      <div className="flex justify-between items-center">
        <button 
          onClick={startCamera}
          className={`flex items-center gap-2 hover:bg-gray-50 p-3 rounded-xl cursor-pointer flex-1 justify-center transition-all ${isLive ? 'bg-red-50' : ''}`}
        >
          <Video className="text-red-500" size={24} />
          <span className="text-gray-600 font-bold text-sm">Live video</span>
        </button>

        <label className="flex items-center gap-2 hover:bg-gray-50 p-3 rounded-xl cursor-pointer flex-1 justify-center transition-all">
          <Image className="text-green-500" size={24} />
          <span className="text-gray-600 font-bold text-sm">Photo/video</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setImage(e.target.files[0])} />
        </label>

        <button 
          onClick={() => setShowFeelings(!showFeelings)}
          className={`hidden md:flex items-center gap-2 hover:bg-gray-50 p-3 rounded-xl cursor-pointer flex-1 justify-center transition-all ${feeling ? 'bg-yellow-50' : ''}`}
        >
          <Smile className="text-yellow-500" size={24} />
          <span className="text-gray-600 font-bold text-sm">{feeling ? `Feeling ${feeling}` : 'Feeling'}</span>
        </button>
      </div>

      {(description || image || videoFile || isLive) && (
        <button 
          disabled={isLoading}
          onClick={handlePost} 
          className="w-full mt-4 py-2.5 rounded-xl font-black text-white bg-facebookBlue hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
        >
          {isLoading ? 'Posting...' : 'Post'}
        </button>
      )}
    </div>
  );
};
export default CreatePost;
