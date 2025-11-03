import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { appointmentServices } from '@/services/firebaseServices';
import {
  VideoCameraIcon,
  VideoCameraSlashIcon,
  MicrophoneIcon,
  PhoneXMarkIcon,
  ChatBubbleLeftRightIcon,
  ComputerDesktopIcon,
  Cog6ToothIcon,
  UsersIcon,
  ClockIcon,
  CalendarIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { HeartIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/solid';

const parseAppointmentDateTime = (appointment) => {
  if (!appointment?.appointmentDate || !appointment?.appointmentTime) {
    return null;
  }

  const [time, modifier] = appointment.appointmentTime.split(' ');
  if (!time || !modifier) return null;

  let [hours, minutes] = time.split(':');
  if (typeof minutes === 'undefined') {
    minutes = '00';
  }

  let parsedHours = parseInt(hours, 10);
  const parsedMinutes = parseInt(minutes, 10);

  if (modifier.toUpperCase() === 'PM' && parsedHours !== 12) {
    parsedHours += 12;
  }
  if (modifier.toUpperCase() === 'AM' && parsedHours === 12) {
    parsedHours = 0;
  }

  const isoString = `${appointment.appointmentDate}T${parsedHours.toString().padStart(2, '0')}:${parsedMinutes
    .toString()
    .padStart(2, '0')}:00`;
  return new Date(isoString);
};

const VideoCall = () => {
  const { user } = useAuth();
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [remoteUserConnected, setRemoteUserConnected] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [callNotes, setCallNotes] = useState('');
  const [appointmentData, setAppointmentData] = useState(null);
  const [loadingAppointment, setLoadingAppointment] = useState(true);
  const [appointmentError, setAppointmentError] = useState(null);

  const appointmentDateTime = useMemo(() => parseAppointmentDateTime(appointmentData), [appointmentData]);

  useEffect(() => {
    let interval;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  useEffect(() => {
    // Initialize video stream when component mounts
    initializeVideo();
    return () => {
      // Cleanup video streams
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const initializeVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  useEffect(() => {
    const loadAppointment = async () => {
      try {
        setLoadingAppointment(true);
        const data = await appointmentServices.getAppointmentById(appointmentId);
        if (!data) {
          setAppointmentError('Appointment not found or may have been removed.');
          return;
        }
        setAppointmentData(data);
      } catch (error) {
        console.error('Error loading appointment:', error);
        setAppointmentError('Unable to load appointment details. Please try again later.');
      } finally {
        setLoadingAppointment(false);
      }
    };

    if (appointmentId) {
      loadAppointment();
    } else {
      setAppointmentError('No appointment reference provided.');
      setLoadingAppointment(false);
    }
  }, [appointmentId]);

  const doctorName = appointmentData?.doctorName || 'Your doctor';

  const startCall = async () => {
    setIsConnecting(true);
    // Simulate connection delay
    setTimeout(() => {
      setIsCallActive(true);
      setIsConnecting(false);
      setRemoteUserConnected(true);
      // Add system message
      setChatMessages([{
        id: Date.now(),
        sender: 'system',
        message: `Connecting to ${doctorName}...`,
        timestamp: new Date()
      }]);
    }, 2000);
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallDuration(0);
    setRemoteUserConnected(false);
    setChatMessages([]);
    // In real app, this would navigate back or show call summary
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current && videoRef.current.srcObject) {
      const audioTracks = videoRef.current.srcObject.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted; // Toggle audio
      });
    }
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    if (videoRef.current && videoRef.current.srcObject) {
      const videoTracks = videoRef.current.srcObject.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = isVideoOff; // Toggle video
      });
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true, 
          audio: true 
        });
        setIsScreenSharing(true);
        // In real app, would replace video stream with screen stream
      } catch (error) {
        console.error('Error sharing screen:', error);
      }
    } else {
      setIsScreenSharing(false);
      // Resume camera stream
      initializeVideo();
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: user.displayName || 'You',
        message: newMessage,
        timestamp: new Date()
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const saveNotes = () => {
    // In real app, save notes to database
    alert('Notes saved successfully!');
    setShowNotes(false);
  };

  if (loadingAppointment) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner text="Connecting to your doctor..." />
      </div>
    );
  }

  if (appointmentError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <InformationCircleIcon className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to start video call</h2>
          <p className="text-gray-600 mb-6">{appointmentError}</p>
          <button
            onClick={() => navigate('/patient/appointments')}
            className="px-5 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
          >
            Back to appointments
          </button>
        </motion.div>
      </div>
    );
  }

  if (!appointmentData) {
    return null;
  }

  if (appointmentData.type && appointmentData.type !== 'video') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-8 max-w-md">
          <VideoCameraIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">This appointment is not a video consultation</h2>
          <p className="text-gray-600 mb-6">
            Please review the appointment details from your dashboard or contact support if you need assistance.
          </p>
          <button
            onClick={() => navigate('/patient/appointments')}
            className="px-5 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
          >
            View appointments
          </button>
        </motion.div>
      </div>
    );
  }

  const specialty = appointmentData.specialization || appointmentData.specialty || 'General Consultation';
  const appointmentReason = appointmentData.reason || 'Follow-up consultation';
  const formattedDate = appointmentDateTime
    ? appointmentDateTime.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : appointmentData.appointmentDate || 'Date to be confirmed';
  const formattedTime = appointmentDateTime
    ? appointmentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : appointmentData.appointmentTime || '--';

  if (!isCallActive && !isConnecting) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4"
        >
          {/* Appointment Info */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <VideoCameraIcon className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Video Consultation</h1>
            <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <UsersIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">With:</span>
                  <span className="font-medium">{doctorName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ClockIcon className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{formattedTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <InformationCircleIcon className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Reason:</span>
                  <span className="font-medium">{appointmentReason}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <HeartIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Specialization:</span>
                  <span className="font-medium">{specialty}</span>
                </div>
                {appointmentData.appointmentNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    <ClipboardDocumentListIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Appt. No.:</span>
                    <span className="font-medium">{appointmentData.appointmentNumber}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Video Preview */}
          <div className="relative mb-6 rounded-lg overflow-hidden bg-gray-900">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-48 object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              You
            </div>
          </div>

          {/* Start Call Button */}
          <button
            onClick={startCall}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Start Video Call
          </button>
        </motion.div>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-white"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Connecting...</h2>
          <p className="text-gray-300">Please wait while we connect you to {appointmentData.doctorName}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium">Live Call</span>
            </div>
            <div className="text-gray-300 text-sm">
              Duration: {formatDuration(callDuration)}
            </div>
          </div>
          <div className="text-white text-sm">
            {appointmentData.doctorName} - {appointmentData.specialization}
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 flex">
        {/* Video Container */}
        <div className="flex-1 relative">
          {/* Remote Video */}
          <div className="absolute inset-0 bg-gray-800">
            {remoteUserConnected ? (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl font-bold">
                      {appointmentData.doctorName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold">{appointmentData.doctorName}</h3>
                  <p className="text-blue-200">{appointmentData.specialization}</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <UsersIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Waiting for {appointmentData.doctorName} to join...</p>
                </div>
              </div>
            )}
          </div>

          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-600">
            <video
              ref={videoRef}
              autoPlay
              muted
              className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
            />
            {isVideoOff && (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <VideoCameraSlashIcon className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              You {isMuted && '(Muted)'}
            </div>
          </div>

          {/* Call Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-4 bg-black bg-opacity-50 backdrop-blur-sm rounded-full px-6 py-4">
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full transition-colors ${
                  isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {isMuted ? (
                  <div className="relative">
                    <MicrophoneIcon className="h-5 w-5 text-white" />
                    <XMarkIcon className="h-3 w-3 text-white absolute -top-1 -right-1" />
                  </div>
                ) : (
                  <MicrophoneIcon className="h-5 w-5 text-white" />
                )}
              </button>

              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full transition-colors ${
                  isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {isVideoOff ? (
                  <VideoCameraSlashIcon className="h-5 w-5 text-white" />
                ) : (
                  <VideoCameraIcon className="h-5 w-5 text-white" />
                )}
              </button>

              <button
                onClick={toggleScreenShare}
                className={`p-3 rounded-full transition-colors ${
                  isScreenSharing ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                <ComputerDesktopIcon className="h-5 w-5 text-white" />
              </button>

              <button
                onClick={() => setShowChat(!showChat)}
                className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors relative"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
                {chatMessages.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">{chatMessages.length}</span>
                  </div>
                )}
              </button>

              <button
                onClick={() => setShowNotes(!showNotes)}
                className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors"
              >
                <ClipboardDocumentListIcon className="h-5 w-5 text-white" />
              </button>

              <button
                onClick={endCall}
                className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
              >
                <PhoneXMarkIcon className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-80 bg-white border-l border-gray-200 flex flex-col"
            >
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Chat</h3>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`
                    ${msg.sender === 'system' ? 'text-center' : ''}
                  `}>
                    {msg.sender === 'system' ? (
                      <div className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1 inline-block">
                        {msg.message}
                      </div>
                    ) : (
                      <div className={`
                        max-w-xs rounded-lg p-3 ${
                          msg.sender === (user.displayName || 'You')
                            ? 'bg-blue-500 text-white ml-auto'
                            : 'bg-gray-100 text-gray-900'
                        }
                      `}>
                        <div className="text-sm font-medium mb-1">{msg.sender}</div>
                        <div className="text-sm">{msg.message}</div>
                        <div className="text-xs opacity-75 mt-1">
                          {msg.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Send
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notes Sidebar */}
        <AnimatePresence>
          {showNotes && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-80 bg-white border-l border-gray-200 flex flex-col"
            >
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Call Notes</h3>
              </div>
              
              <div className="flex-1 p-4">
                <textarea
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="Add your notes about this consultation..."
                  className="w-full h-full resize-none border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={saveNotes}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Save Notes
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VideoCall;