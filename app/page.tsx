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
import { PhoneOffIcon, Mic, Play } from 'lucide-react';

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

// Bippo Logo Component (red theme)
const BippoLogo = () => (
  <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 via-red-400 to-red-600 rounded-full shadow-lg">
    <span className="text-white font-bold text-2xl">B</span>
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
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsHandler>
        {({ showMuteSpeakerButton, modelOverride, showDebugMessages, showUserTranscripts }: SearchParamsProps) => (
          <div className="flex flex-col items-center justify-center px-4">
            {/* Main Area */}
            <div className="max-w-[1206px] mx-auto w-full py-8 px-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl">
              <div className="flex flex-col justify-center lg:flex-row">
                {/* Action Area */}
                <div className="w-full lg:w-2/3 pr-0 lg:pr-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse"></div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                      {demoConfig.title}
                    </h1>
                  </div>
                  
                  <div className="flex flex-col justify-between items-start h-full p-6">
                    <div className="mt-12 self-center">
                      <BippoLogo />
                    </div>
                    
                    {isCallActive ? (
                      <div className="w-full mt-8">
                        <div className="mb-6 relative">
                          <div 
                            ref={transcriptContainerRef}
                            className="h-[300px] p-4 overflow-y-auto relative bg-black/20 rounded-xl border border-white/10"
                          >
                            {callTranscript && callTranscript.map((transcript, index) => (
                              <div key={index} className="mb-3">
                                {showUserTranscripts ? (
                                  <>
                                    <p className="text-red-300 text-sm font-medium mb-1">
                                      {transcript.speaker === 'agent' ? "AI Assistant" : "You"}
                                    </p>
                                    <p className="text-gray-100 bg-white/5 rounded-lg p-3">
                                      {transcript.text}
                                    </p>
                                  </>
                                ) : (
                                  transcript.speaker === 'agent' && (
                                    <>
                                      <p className="text-red-300 text-sm font-medium mb-1">AI Assistant</p>
                                      <p className="text-gray-100 bg-white/5 rounded-lg p-3">
                                        {transcript.text}
                                      </p>
                                    </>
                                  )
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/20 to-transparent pointer-events-none rounded-t-xl" />
                        </div>
                        
                        <div className="flex justify-between space-x-4 w-full">
                          <MicToggleButton role={Role.USER}/>
                          { showMuteSpeakerButton && <MicToggleButton role={Role.AGENT}/> }
                          <button
                            type="button"
                            className="flex-grow flex items-center justify-center h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                            onClick={handleEndCallButtonClick}
                            disabled={!isCallActive}
                          >
                            <PhoneOffIcon width={20} className="text-white mr-2" />
                            <span>End Call</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full mt-8">
                        <div className="h-[300px] text-gray-300 mb-8 text-center flex flex-col justify-center">
                          <div className="mb-6">
                            <Play className="w-16 h-16 mx-auto text-red-400 mb-4" />
                          </div>
                          <p className="text-lg leading-relaxed max-w-md mx-auto">
                            {demoConfig.overview}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="w-full h-14 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                          onClick={() => handleStartCallButtonClick(modelOverride, showDebugMessages)}
                        >
                          <Mic className="w-5 h-5" />
                          <span>Start Voice Demo</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Call Status */}
                <CallStatus status={agentStatus}>
                </CallStatus>
              </div>
            </div>
            
            {/* Debug View */}
            <DebugMessages debugMessages={callDebugMessages} />
          </div>
        )}
      </SearchParamsHandler>
    </Suspense>
  )
}