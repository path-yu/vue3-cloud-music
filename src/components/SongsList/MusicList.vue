<script lang="tsx">
/* eslint-disable consistent-return */
import { useDbClickPlay } from '@/hook/useDbClickPlay';
import { useMainStore } from '@/stores/main';
import { formateSongsAuthor } from '@/utils';
import { HeartOutline, Heart, DownloadOutline } from '@vicons/ionicons5';
import { VolumeMuteFilled, VolumeUpFilled } from '@vicons/material';
import { useThemeVars, type DataTableColumns } from 'naive-ui';
import { NIcon, NTime, NTag } from 'naive-ui';
import { computed, defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

type RowData= {
  like:boolean;
  ar:any[]
  al:{name:string};
  dt:number;
  name:string;
  mv:number;
  id:string;
  // 免费或无版权1: VIP 歌曲4: 购买专辑8: 非会员可免费播放低音质，会员可播放高音质及下载 
  //fee 为 1 或 8 的歌曲均可单独购买 2 元单曲
  fee:number;
  isSearch?:boolean;
  index?:number;
}

export default defineComponent({
  props: {
    songList: { type: Array, default: () => [] },
    loading: { type: Boolean },
    playListId: { type: Number, required: true },
    rawSongList: { type: Array, default: () => [] }
  },
  emits: ['updateMusicListLike'],
  setup(
    props, ctx
  ) {
    const router = useRouter();
    const themeVars = useThemeVars();
    const mainStore = useMainStore();
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
        width: 50,
        render (
          row, index
        ) {
          return <div class="flex items-center">
            {
              +mainStore.currentPlayIndex === index && mainStore.playList.length && mainStore.currentPlayListId === props.playListId
                ? <NIcon color={mainStore.playing
                  ? themeVars.value.primaryColor
                  : themeVars.value.textColor1} component={mainStore.playing
                  ? VolumeUpFilled
                  :VolumeMuteFilled } size={20} class="pr-3"></NIcon>
                : <span class="pr-4 opacity-50">
                  { index < 9
                    ? '0' + (index + 1)
                    : (index + 1) }
                </span>
            }
            <heart-icon
              id={row.id}
              like={row.like}
              size={20} likeSuccess={(like:boolean) => likeSuccess(
                like, index
              )}
            /> 
          </div>;
        }
      },
      {
        title: '标题',
        key: 'name',
        width: '200',
        render(row) {
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
          return <p class="text-sm truncate">
            { row.al.name }
          </p>;
        }
      },
      {
        title: '专辑',
        key: 'album',
        width: '120',
        render(row) {
          return <p class="text-sm truncate">
            { formateSongsAuthor(row.ar) }
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
    const rowClassName = (
      _row: any, index:number
    ) => {
      if (index === +mainStore.currentPlayIndex) {
        return 'current-play bg-gray-200/80 dark:bg-gray-200/20';
      }
      return '';
    };
    const likeSuccess = (
      like:boolean, index:number
    ) => {
      ctx.emit(
        'updateMusicListLike', like, index
      );
    };
    const handleClick = useDbClickPlay();
    return () => {
      return <div >
        <n-data-table
          striped
          columns={columns}
          data={props.songList}
          max-height={650}
          row-class-name={rowClassName}
          virtual-scroll
          loading={props.loading}
          row-props={(
            row: any, index:number
          ) => {
            let rawIndex = row.isSearch
              ? row.index
              : index;
            return {
              ondblclick: () => handleClick(
                props.rawSongList, props.playListId, row, rawIndex
              ) 
            };
          }}
        />
      </div>;
    };
  }
});
</script>

<style scoped>
:deep(.n-data-table-th:first-child){
  text-align: center;
}
:deep(.current-play>.n-data-table-td){
 background-color: transparent;
}
</style>
