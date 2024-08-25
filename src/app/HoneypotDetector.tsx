'use client'

import React, { useState } from 'react';
import { 
  getTokenInfo, 
  getTransactionHistory, 
  getLiquidityPoolInfo, 
  getTokenHolders,
  getTokenMetadata,
  analyzeHoneypot 
} from '../utils/solanaUtils';

const HoneypotDetector: React.FC = () => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [analysis, setAnalysis] = useState<{ redFlags: string[], greenFlags: string[] }>({ redFlags: [], greenFlags: [] });
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const tokenInfo = await getTokenInfo(tokenAddress);
      const transactionHistory = await getTransactionHistory(tokenAddress);
      const liquidityPoolInfo = await getLiquidityPoolInfo(tokenAddress);
      const tokenHolders = await getTokenHolders(tokenAddress);
      const tokenMetadata = await getTokenMetadata(tokenAddress);

      const { redFlags, greenFlags } = analyzeHoneypot(
        tokenInfo, 
        transactionHistory, 
        liquidityPoolInfo, 
        tokenHolders,
        tokenMetadata
      );
      setAnalysis({ redFlags, greenFlags });
    } catch (error) {
      console.error('Error during analysis:', error);
      setAnalysis({ redFlags: ['Error occurred during analysis'], greenFlags: [] });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold text-blue-600 mb-6">Solana Honeypot Detector</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col">
                  <label className="leading-loose text-blue-600">Token Address</label>
                  <input
                    type="text"
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    placeholder="Enter token address"
                    className="px-4 py-2 border focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className={`flex justify-center items-center w-full px-4 py-3 rounded-md focus:outline-none ${
                      loading
                        ? 'bg-blue-300 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    <span className="text-white">{loading ? 'Analyzing...' : 'Analyze'}</span>
                  </button>
                </div>
              </div>
              {(analysis.redFlags.length > 0 || analysis.greenFlags.length > 0) && (
                <div className="py-4 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <h2 className="text-xl font-semibold text-blue-600">Analysis Results:</h2>
                  {analysis.redFlags.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-red-600">Potential Issues:</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {analysis.redFlags.map((flag, index) => (
                          <li key={index} className="text-red-500">{flag}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysis.greenFlags.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-green-600">Good Signs:</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {analysis.greenFlags.map((flag, index) => (
                          <li key={index} className="text-green-500">{flag}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysis.redFlags.length === 0 && analysis.greenFlags.length === 0 && (
                    <p className="text-blue-500">No significant flags detected. However, always do your own research.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoneypotDetector;