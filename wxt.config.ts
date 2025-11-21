import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Website Blocker with Grace Period',
    description: 'Block websites with optional grace period access',
    version: '1.0.0',
    permissions: [
      'storage',
      'tabs',
      'webNavigation',
      'activeTab'
    ],
    host_permissions: ['<all_urls>'],
  },
});
