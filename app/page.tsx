'use client';

import React, { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation'; 
import { startCall, endCall } from '@/lib/callFunctions'
import { CallConfig, SelectedTool } from '@/lib/types'
import demoConfig from '@/app/demo-config';
import { Role, Transcript, UltravoxExperimentalMessageEvent, UltravoxSessionStatus } from 'ultravox-client';
import BorderedImage from '@/components/BorderedImage';
import CallStatus from '@/components/CallStatus';
import DebugMessages from '@/components/DebugMessages';
import MicToggleButton from '@/components/MicToggleButton';
import { PhoneOffIcon, Mic, Play, Sparkles, MessageSquare } from 'lucide-react';

type SearchParamsProps = {
  showMuteSpeakerButton: boolean;
  modelOverride: string | undefined;
  showDebugMessages: boolean;
  showUserTranscripts: boolean;
};

type SearchParamsHandlerProps = {
  children: (props: SearchParamsProps) => React.ReactNode;
};

function SearchParamsHandler({ children }: SearchParamsHandlerProps) {
  // Process query params to see if we want to change the behavior for showing speaker mute button or changing the model
  const searchParams = useSearchParams();
  const showMuteSpeakerButton = searchParams.get('showSpeakerMute') === 'true';
  const showDebugMessages = searchParams.get('showDebugMessages') === 'true';
  const showUserTranscripts = searchParams.get('showUserTranscripts') === 'true';
  let modelOverride: string | undefined;
  
  if (searchParams.get('model')) {
    modelOverride = "fixie-ai/" + searchParams.get('model');
  }

  return children({ showMuteSpeakerButton, modelOverride, showDebugMessages, showUserTranscripts });
}

// Bippo Logo Component (matching the main site theme - red/blue gradient)
const BippoLogo = () => (
  <div className="relative group">
    <div className="absolute -inset-2 bg-gradient-to-r from-red-500 via-red-400 to-blue-500 rounded-full opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300"></div>
    <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300">
      <span className="text-white font-bold text-4xl">B</span>
    </div>
  </div>
);

export default function Home() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [agentStatus, setAgentStatus] = useState<string>('off');
  const [callTranscript, setCallTranscript] = useState<Transcript[] | null>([]);
  const [callDebugMessages, setCallDebugMessages] = useState<UltravoxExperimentalMessageEvent[]>([]);
  const [customerProfileKey, setCustomerProfileKey] = useState<string | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [callTranscript]);

  const handleStatusChange = useCallback((status: UltravoxSessionStatus | string | undefined) => {
    if(status) {
      setAgentStatus(status);
    } else {
      setAgentStatus('off');
    }
  }, []);

  const handleTranscriptChange = useCallback((transcripts: Transcript[] | undefined) => {
    if(transcripts) {
      setCallTranscript([...transcripts]);
    }
  }, []);

  const handleDebugMessage = useCallback((debugMessage: UltravoxExperimentalMessageEvent) => {
    setCallDebugMessages(prevMessages => [...prevMessages, debugMessage]);
  }, []);

  const clearCustomerProfile = useCallback(() => {
    // This will trigger a re-render of CustomerProfileForm with a new empty profile
    setCustomerProfileKey(prev => prev ? `${prev}-cleared` : 'cleared');
  }, []);

  const handleStartCallButtonClick = async (modelOverride?: string, showDebugMessages?: boolean) => {
    try {
      handleStatusChange('Starting call...');
      setCallTranscript(null);
      setCallDebugMessages([]);
      clearCustomerProfile();

      // Generate a new key for the customer profile
      const newKey = `call-${Date.now()}`;
      setCustomerProfileKey(newKey);

      // Setup our call config including the call key as a parameter restriction
      let callConfig: CallConfig = {
        systemPrompt: demoConfig.callConfig.systemPrompt,
        model: modelOverride || demoConfig.callConfig.model,
        languageHint: demoConfig.callConfig.languageHint,
        voice: demoConfig.callConfig.voice,
        temperature: demoConfig.callConfig.temperature,
        maxDuration: demoConfig.callConfig.maxDuration,
        timeExceededMessage: demoConfig.callConfig.timeExceededMessage
      };

      const paramOverride: { [key: string]: any } = {
        "callId": newKey
      }

      let cpTool: SelectedTool | undefined = demoConfig?.callConfig?.selectedTools?.find(tool => tool.toolName === "createProfile");
      
      if (cpTool) {
        cpTool.parameterOverrides = paramOverride;
      }
      callConfig.selectedTools = demoConfig.callConfig.selectedTools;

      await startCall({
        onStatusChange: handleStatusChange,
        onTranscriptChange: handleTranscriptChange,
        onDebugMessage: handleDebugMessage
      }, callConfig, showDebugMessages);

      setIsCallActive(true);
      handleStatusChange('Call started successfully');
    } catch (error) {
      handleStatusChange(`Error starting call: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleEndCallButtonClick = async () => {
    try {
      handleStatusChange('Ending call...');
      await endCall();
      setIsCallActive(false);

      clearCustomerProfile();
      setCustomerProfileKey(null);
      handleStatusChange('Call ended successfully');
    } catch (error) {
      handleStatusChange(`Error ending call: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SearchParamsHandler>
        {({ showMuteSpeakerButton, modelOverride, showDebugMessages, showUserTranscripts }: SearchParamsProps) => (
          <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 py-8 px-4">
            <div className="flex flex-col items-center justify-center">
              {/* Main Container */}
              <div className="max-w-6xl mx-auto w-full">
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    {/* Left Panel - Main Interaction Area */}
                    <div className="w-full lg:w-2/3 p-8 lg:p-12">
                      {/* Header */}
                      <div className="mb-8">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="relative">
                            <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse"></div>
                            <div className="absolute inset-0 w-3 h-3 bg-red-400 rounded-full animate-ping"></div>
                          </div>
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-blue-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                            <Sparkles className="w-4 h-4" />
                            <span>AI-Powered Voice Demo</span>
                          </div>
                        </div>
                        
                        <h1 className="text-4xl font-bold mb-3">
                          <span className="bg-gradient-to-r from-red-500 via-red-600 to-blue-500 bg-clip-text text-transparent">
                            {demoConfig.title}
                          </span>
                        </h1>
                        
                        <p className="text-gray-600 text-lg leading-relaxed">
                          Experience natural voice conversation powered by advanced AI
                        </p>
                      </div>
                      
                      {/* Logo - Centered when inactive */}
                      {!isCallActive && (
                        <div className="flex justify-center mb-8">
                          <BippoLogo />
                        </div>
                      )}
                      
                      {/* Transcript Area - Active Call */}
                      {isCallActive ? (
                        <div className="space-y-6">
                          {/* Conversation Display */}
                          <div className="relative">
                            <div className="absolute top-0 left-0 right-0 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-blue-500 text-white rounded-t-2xl">
                              <MessageSquare className="w-4 h-4" />
                              <span className="text-sm font-semibold">Live Conversation</span>
                            </div>
                            
                            <div 
                              ref={transcriptContainerRef}
                              className="h-[400px] pt-12 p-6 overflow-y-auto bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200 scroll-smooth"
                              style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#f97316 #f3f4f6'
                              }}
                            >
                              {callTranscript && callTranscript.length > 0 ? (
                                callTranscript.map((transcript, index) => (
                                  <div key={index} className="mb-4 animate-fadeIn">
                                    {showUserTranscripts ? (
                                      <div className={`flex ${transcript.speaker === 'agent' ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`max-w-[80%] ${transcript.speaker === 'agent' ? 'items-start' : 'items-end'}`}>
                                          <p className={`text-xs font-semibold mb-1 ${transcript.speaker === 'agent' ? 'text-red-600' : 'text-blue-600'}`}>
                                            {transcript.speaker === 'agent' ? "AI Assistant" : "You"}
                                          </p>
                                          <div className={`rounded-2xl px-4 py-3 ${
                                            transcript.speaker === 'agent' 
                                              ? 'bg-gradient-to-br from-red-50 to-red-100 border border-red-200' 
                                              : 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200'
                                          }`}>
                                            <p className="text-gray-800 leading-relaxed">
                                              {transcript.text}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      transcript.speaker === 'agent' && (
                                        <div className="flex justify-start">
                                          <div className="max-w-[80%]">
                                            <p className="text-xs font-semibold mb-1 text-red-600">AI Assistant</p>
                                            <div className="rounded-2xl px-4 py-3 bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
                                              <p className="text-gray-800 leading-relaxed">
                                                {transcript.text}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                ))
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <div className="text-center text-gray-400">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>Conversation will appear here...</p>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Gradient fade at bottom */}
                            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none rounded-b-2xl" />
                          </div>
                          
                          {/* Control Buttons */}
                          <div className="flex gap-3">
                            <MicToggleButton role={Role.USER}/>
                            {showMuteSpeakerButton && <MicToggleButton role={Role.AGENT}/>}
                            <button
                              type="button"
                              className="flex-1 flex items-center justify-center h-14 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                              onClick={handleEndCallButtonClick}
                              disabled={!isCallActive}
                            >
                              <PhoneOffIcon className="w-5 h-5 mr-2" />
                              <span>End Call</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Pre-Call State */
                        <div className="space-y-8">
                          {/* Overview Card */}
                          <div className="bg-gradient-to-br from-red-50 to-blue-50 rounded-2xl p-8 border border-red-100">
                            <div className="flex items-start gap-4 mb-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Play className="w-6 h-6 text-red-600" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">How It Works</h3>
                                <p className="text-gray-700 leading-relaxed">
                                  {demoConfig.overview}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                         
                          
                          {/* Start Button */}
                          <button
                            type="button"
                            className="w-full h-16 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 group"
                            onClick={() => handleStartCallButtonClick(modelOverride, showDebugMessages)}
                          >
                            <Mic className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            <span>Start Voice Demo</span>
                          </button>
                          
                          <p className="text-center text-sm text-gray-500">
                            Click the button above and allow microphone access to begin
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Right Panel - Call Status */}
                    <div className="w-full lg:w-1/3 bg-gradient-to-br from-gray-50 to-white border-l border-gray-200 p-8 lg:p-10">
                      <CallStatus status={agentStatus} />
                    </div>
                  </div>
                </div>
                
                {/* Debug Messages */}
                {showDebugMessages && callDebugMessages.length > 0 && (
                  <div className="mt-8">
                    <DebugMessages debugMessages={callDebugMessages} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </SearchParamsHandler>
    </Suspense>
  )
}

// Add fadeIn animation to your global CSS or tailwind config
// @keyframes fadeIn {
//   from { opacity: 0; transform: translateY(10px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// .animate-fadeIn {
//   animation: fadeIn 0.3s ease-out;
// }