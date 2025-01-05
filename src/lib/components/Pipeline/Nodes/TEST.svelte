<script src="https://unpkg.com/lucide@latest"></script>

<div class="w-full max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden">
  <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200">
    <div class="flex items-center space-x-2">
      <i data-lucide="zap" class="w-4 h-4 text-gray-600"></i>
      <span class="text-sm font-semibold text-black">Pipeline trigger</span>
    </div>
    <div class="flex items-center space-x-2 bg-black text-white rounded-full px-2 py-1">
      <i data-lucide="play" class="w-2 h-2"></i>
      <span class="text-xs">Run</span>
    </div>
  </div>
  <div class="px-4 py-4 space-y-4">
    <div class="text-sm text-gray-600">Chat Message List</div>
    <div class="flex items-center border border-gray-300 rounded-lg px-3 py-2">
      <span class="text-sm text-black">[System]: "You are a helpful assistant."</span>
    </div>
    <div class="flex items-center border border-gray-300 rounded-lg px-3 py-2">
      <span class="text-sm text-black">[User]: "What are the benefits of renewable energy?"</span>
    </div>
    <div class="flex items-center border border-gray-300 rounded-lg px-3 py-2">
      <span class="text-sm text-black">[Assistant]: "Renewable energy reduces carbon emissions..."</span>
    </div>
    <div class="flex items-center justify-center bg-white text-gray-600 border border-gray-300 rounded-full px-2 py-1">
      <i data-lucide="plus" class="w-2 h-2"></i>
      <span class="text-xs">2</span>
    </div>
  </div>
</div>

<style>
  .rounded-lg {
    border-radius: 12px;
  }
  .rounded-full {
    border-radius: 100px;
  }
  .text-sm {
    font-size: 14px;
    letter-spacing: -0.4px;
  }
  .text-xs {
    font-size: 8px;
    letter-spacing: -0.4px;
  }
</style>