/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const [masterKey, setMasterKey] = useState<string | null>(null);

  if (!masterKey) {
    return (
      <ErrorBoundary>
        <Login onLogin={setMasterKey} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Dashboard 
        user={null}
        masterKey={masterKey} 
        onLogout={() => setMasterKey(null)} 
      />
    </ErrorBoundary>
  );
}

