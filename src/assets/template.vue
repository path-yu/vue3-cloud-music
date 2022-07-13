<script setup lang="ts">

</script>

<template>
  <div>
    <n-scrollbar style="max-height:500px">
      <!-- 搜索历史 -->
      <div v-if="mainStore.searchHistory.length && showPopover && !mainStore.searchKeyword.length" class="p-4 pb-0">
        <div class="flex justify-between items-center opacity-70">
          <div>
            <span class="pr-2">搜索历史</span>
            <n-popconfirm :on-positive-click="() => mainStore.clearSearchHistory()" positive-text="确定">
              <template #trigger>
                <n-icon class="cursor-pointer" :component="Delete" />
              </template>
              确定删除历史记录?
            </n-popconfirm>
          </div>
          <n-button v-if="parseInt(defaultHeight) > 62" text @click="spread = !spread">
            {{ spread ? '收起' :'查看全部' }}
          </n-button>
        </div>
        <div class="mt-2 transition-height" :style="historyListStyle">
          <n-space id="historyList">
            <n-tag
              v-for="(item,index) in mainStore.searchHistory"
              :key="item"
              closable size="small"
              round
              @click="toSearchResult(item)"
              @close="(e:MouseEvent) => handleClearClick(e,index)"
            >
              {{ item }}
            </n-tag>
          </n-space>
        </div>
      </div>
      <!-- 热搜榜 -->
      <div v-show="showPopover && !mainStore.searchKeyword.length">
        <p class="pl-4 mt-4 opacity-70">
          热搜榜
        </p>
        <n-spin :show="hotSearchLoading">
          <div v-show="hotSearchLoading" class="h-60" />
          <div 
            v-for="(item,index) in hotSearch" 
            :key="item.searchWord" class="flex items-center p-5 hover:bg-gray-100 dark:hover:bg-gray-100/20 cursor-pointer"
            @click="toSearchResult(item.searchWord)"
          >
            <span
              class="text-base"
              :style="{color:index >= 0 && index <= 2 ? themeVars.primaryColor : themeVars.textColor1}"
            >
              {{ index+1 }}
            </span>
            <div class="ml-4">
              <span :style="{fontWeight:index >= 0 && index <= 2 ?'bold' :'initial'}"> {{ item.searchWord }}</span>
              <span class="pl-2 text-sm opacity-40">{{ item.score }}</span>
            </div>
          </div>
        </n-spin>
      </div>
      <!-- 搜索建议 -->
      <div v-if="mainStore.searchKeyword.length > 0 && showPopover" class="py-4">
        <n-spin :show="suggestLoading" size="small" description="搜索中...">
          <div v-show="suggestLoading" class="h-80" />
          <div>
            <p v-show="!suggestLoading && suggestResult.songs" class="flex items-center pl-4 text-base opacity-50">
              <n-icon :component="Music" />
              <span class="ml-2">单曲</span>
            </p>
            <div
              v-for="item in suggestResult.songs" 
              :key="item.id"
              class="py-2 pl-10 cursor-pointer base-hover-bg"
              @click="handleSearchSongClick(item)"
            >
              <span v-html="item.nameRichText" />
              <span v-if="item.alias[0]" class="opacity-50">
                （<span v-html="item.alias[0]" />）
              </span>
              <span> - </span>
              <span v-html="item.formatAuthorRichText" />
            </div>
            <p v-show="!suggestLoading && suggestResult.playlists" class="flex items-center pl-4 text-base opacity-50">
              <n-icon :component="List" />
              <span class="ml-2">歌单</span>
            </p>
            <div
              v-for="item in suggestResult.playlists" 
              :key="item.id"
              class="py-2 pl-10 cursor-pointer base-hover-bg"
              @click="handleSearchPlayListClick(item.id)"
              v-html="item.nameRichText"
            />
            <base-empty v-show="mainStore.searchKeyword.length > 0 && isEmptyObject(suggestResult) && !suggestLoading" description="没有搜索建议" />
          </div>
        </n-spin>
      </div>
    </n-scrollbar>
  </div>
</template>

<style scoped>

</style>
