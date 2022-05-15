<script setup lang="tsx">
import { formateSongsAuthor } from '@/utils';
import { HeartOutline, Heart, DownloadOutline } from '@vicons/ionicons5';
import { useThemeVars, type DataTableColumns } from 'naive-ui';
import { NIcon, NTime, NEllipsis, NTag } from 'naive-ui';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
type RowData= {
  like:boolean;
  ar:any[]
  al:{name:string};
  dt:number;
  name:string;
  mv:number;
  // 免费或无版权1: VIP 歌曲4: 购买专辑8: 非会员可免费播放低音质，会员可播放高音质及下载 
  //fee 为 1 或 8 的歌曲均可单独购买 2 元单曲
  fee:number;
}
defineProps<{
  songList:any[]
  loading:boolean;
}>();
const router = useRouter();
const themeVars = useThemeVars();
const tagColor = computed(() => {
  return {
    textColor: themeVars.value.primaryColor,
    borderColor: themeVars.value.primaryColor
  };
});
const columns:DataTableColumns<RowData> = [
  {
    title: '操作',
    key: 'row',
    width: 70,
    render (
      row, index
    ) {
      return <div class="flex items-center">
        <span class="pr-4 opacity-50">
          { index < 9
            ? '0' + (index + 1)
            : (index + 1) }
        </span>
        <NIcon size={20} color={row.like
          ? themeVars.value.primaryColor
          : themeVars.value.textColor1} class="cursor-pointer" component={ row.like
          ? Heart
          : HeartOutline} />
        <NIcon class="ml-2" size={20} component={DownloadOutline}/>
      </div>;
    }
  },
  {
    title: '标题',
    key: 'name',
    width: '200',
    render(
      row, index
    ) {
      return <div>
        {row.name}
        {row.mv !== 0
          ? <NTag onClick={() => router.push(`/mv/${row.mv}`)} size="small" color={tagColor.value} class="ml-2">MV</NTag>
          : null}
        {row.fee === 1
          ? <NTag size="small" color={tagColor.value} class="ml-2">VIP</NTag>
          : null}
      </div>;
    }
  },
  {
    title: '歌手',
    key: 'singer',
    width: '140',
    render(row) {
      return <p class="text-sm">
        <NEllipsis>{ row.al.name }</NEllipsis>
      </p>;
    }
  },
  {
    title: '专辑',
    key: 'album',
    width: '120',
    render(row) {
      return <p class="text-sm">
        <NEllipsis>{ formateSongsAuthor(row.ar) }</NEllipsis>
      </p>;
    }
  },
  {
    title: '时间',
    key: 'time',
    width: 80,
    render(row) {
      return <NTime
        class="text-sm text-left"
        time={row.dt}
        format="mm:ss"
      />;
    }
  }
];
</script>

<template>
  <div>
    <n-data-table
      striped
      :columns="columns"
      :data="songList"
      :max-height="650"
      row-class-name="rowClassName"
      virtual-scroll
      :loading="loading"
    />
  </div>
</template>

<style scoped>
:deep(.n-data-table-th:first-child){
  text-align: center;
}
</style>
