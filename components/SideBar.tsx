
import React, { useState, useEffect } from 'react';
import Preview from './Preview';
import InstructionsPreview from './InstructionsPreview';
import CodeAssistant from './CodeAssistant';
import FileExplorer from './FileExplorer';
import EyeIcon from './icons/EyeIcon';
import SparklesIcon from './icons/SparklesIcon';
import FolderIcon from './icons/FolderIcon';
import { ChatMessage } from '../types';

type ActiveTab = 'preview' | 'assistant' | 'explorer';

interface SideBarProps {
  generationType: 'frontend' | 'backend';
  projectFiles: Record<string, string> | null;
  activeFile: string | null;
  onFileSelect: (file: string) => void;
  chatHistory: ChatMessage[];
  onSendMessage: (instruction: string) => void;
  isModifying: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

const SideBar: React.FC<SideBarProps> = (props) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('preview');

  useEffect(() => {
    // Set default tab based on generation type
    setActiveTab(props.generationType === 'frontend' ? 'preview' : 'preview');
  }, [props.generationType]);

  const previewTabName = props.generationType === 'frontend' ? 'Preview' : 'Instructions';

  const TabButton = ({
    tabName,
    currentTab,
    setTab,
    children,
    label
  }: {
    tabName: ActiveTab,
    currentTab: ActiveTab,
    setTab: (tab: ActiveTab) => void,
    children: React.ReactNode,
    label: string
  }) => (
    <button
      onClick={() => setTab(tabName)}
      className={`flex-1 flex justify-center items-center gap-2 p-3 text-sm font-medium transition-colors border-b-2 ${
        currentTab === tabName
          ? 'text-dark-text-primary border-brand-blue'
          : 'text-dark-text-secondary border-transparent hover:bg-dark-bg hover:text-dark-text-primary'
      }`}
      aria-label={`Switch to ${label} tab`}
    >
      {children}
      {label}
    </button>
  );

  return (
    <aside className="flex flex-col bg-dark-bg border-l border-dark-border">
      <header className="flex-shrink-0 flex items-center border-b border-dark-border bg-dark-surface h-[45px]">
        <TabButton tabName="preview" currentTab={activeTab} setTab={setActiveTab} label={previewTabName}>
            <EyeIcon className="w-4 h-4" />
        </TabButton>
        <TabButton tabName="assistant" currentTab={activeTab} setTab={setActiveTab} label="Assistant">
            <SparklesIcon className="w-4 h-4" />
        </TabButton>
        <TabButton tabName="explorer" currentTab={activeTab} setTab={setActiveTab} label="Explorer">
            <FolderIcon className="w-4 h-4" />
        </TabButton>
      </header>

      <div className="flex-grow overflow-hidden">
        {activeTab === 'preview' && (
          props.generationType === 'frontend' ? (
            <Preview htmlContent={props.projectFiles ? props.projectFiles['index.html'] : null} isTab={true}/>
          ) : (
            <InstructionsPreview content={props.projectFiles ? props.projectFiles['README.md'] : null} isTab={true}/>
          )
        )}
        {activeTab === 'assistant' && (
          <CodeAssistant 
            chatHistory={props.chatHistory}
            onSendMessage={props.onSendMessage}
            isModifying={props.isModifying}
            error={props.error}
            setError={props.setError}
            isTab={true}
          />
        )}
        {activeTab === 'explorer' && (
          <FileExplorer
            files={props.projectFiles ? Object.keys(props.projectFiles) : []}
            activeFile={props.activeFile}
            onFileSelect={props.onFileSelect}
            isTab={true}
          />
        )}
      </div>
    </aside>
  );
};

export default SideBar;
