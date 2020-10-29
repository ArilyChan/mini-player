<template>
  <div class="player">
    <div class="player__top">
      <div class="player-cover">
        <transition-group :name="transitionName">
          <!-- <div
              class="player-cover__item"
              :style="{
                backgroundImage: `url('${track.cover}')`,
                backgroundSize: 'cover',
              }"
              v-for="(track, $index) in tracks"
              v-show="$index == currentTrackIndex"
              :key="$index"
              v-swipeleft="() => prevTrack('slide-x-right')"
              v-swiperight="() => nextTrack('slide-x-left')"
            ></div> -->
          <lazy-background-image
            v-for="(track, $index) in covers"
            :key="track.cover || $index"
            :image-source="track.cover"
            loading-image="./img/arilychan.jpg"
            error-image="./img/arilychan.jpg"
            image-class="player-cover__item"
            background-size="cover"
            v-show="track.index === currentTrackIndex && track.cover == currentTrack.cover"
            v-swipeleft="() => prevTrack('slide-x-right')"
            v-swiperight="() => nextTrack('slide-x-left')"
          />
        </transition-group>
      </div>
      <div class="player-controls">
        <div
          class="player-controls__item -favorite"
          :class="{ active: currentTrack.favorited }"
          @click="favorite"
        >
          <svg class="icon">
            <use xlink:href="#icon-heart-o"></use>
          </svg>
        </div>
        <a
          :href="currentTrack.url"
          target="_blank"
          class="player-controls__item"
        >
          <svg class="icon">
            <use xlink:href="#icon-link"></use>
          </svg>
        </a>
        <div class="player-controls__item" @click="() => prevTrack()">
          <svg class="icon">
            <use xlink:href="#icon-prev"></use>
          </svg>
        </div>
        <div class="player-controls__item" @click="() => nextTrack()">
          <svg class="icon">
            <use xlink:href="#icon-next"></use>
          </svg>
        </div>
        <popover placement="right" ref="volume">
          <template v-slot:content>
            <slider v-model:value="volume" vertical style="height: 10em" />
          </template>
          <!-- <template v-slot:title>
            <span>Title</span>
          </template> -->
          <div class="player-controls__item" @click="mute">
            <svg class="icon">
              <use :xlink:href="muted ? '#icon-mute' : '#icon-sound'"></use>
            </svg>
          </div>
        </popover>
        <div class="player-controls__item -xl js-play" @click="play">
          <svg class="icon">
            <use xlink:href="#icon-pause" v-if="isTimerPlaying"></use>
            <use xlink:href="#icon-play" v-else></use>
          </svg>
        </div>
      </div>
    </div>
    <div class="playing" ref="progress">
      <div class="playing__top">
        <div class="album-info" v-if="currentTrack">
          <div class="album-info__name">{{ currentTrack.name }}</div>
          <div class="album-info__track">{{ currentTrack.artist }}</div>
        </div>
        <div class="playing__duration">{{ duration }}</div>
      </div>
      <div class="playing__bar" @click="clickProgress">
        <div class="playing__current" :style="{ width: barWidth }"></div>
      </div>
      <div class="playing__time">{{ currentTime }}</div>
    </div>
  </div>
</template>

<script>
import Popover from 'ant-design-vue/es/popover'
import Slider from 'ant-design-vue/es/slider'
import VueLazyBackgroundImage from './VueLazyBackgroundImage'
// const VueLazyBackgroundImage = require('./vue-lazy-background-images')

export default {
  computed: {
    covers () {
      return this.tracks.map((track, index) => ({ cover: track.cover, index }))
    },
    currentTrack () {
      return this.tracks[this.currentTrackIndex]
    }
  },
  components: {
    Popover,
    Slider,
    // eslint-disable-next-line vue/no-unused-components
    LazyBackgroundImage: VueLazyBackgroundImage
  },
  watch: {
    volume (val) {
      if (val) this.muted = false
      this.audio.volume = val / 100
    }
  },
  data () {
    return {
      audio: null,
      circleLeft: null,
      barWidth: null,
      duration: null,
      currentTime: null,
      isTimerPlaying: false,
      // currentTrack: null,
      currentTrackIndex: 0,
      transitionName: null,
      volume: 50,
      muted: false
    }
  },
  props: {
    tracks: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    play () {
      if (this.audio.paused) {
        this.audio.play()
        this.isTimerPlaying = true
      } else {
        this.audio.pause()
        this.isTimerPlaying = false
      }
      // this.mediaSessionSetMetadata()
      // this.mediaSessionSetPosition()
    },
    generateTime () {
      if (isNaN(this.audio.duration)) {
        this.barWidth = this.circleLeft = '0%'
        this.duration = 'Loading...'
        this.currentTime = '00:00'
        return
      }
      const width = (100 / this.audio.duration) * this.audio.currentTime
      this.barWidth = width + '%'
      this.circleLeft = width + '%'
      let durmin = Math.floor(this.audio.duration / 60)
      let dursec = Math.floor(this.audio.duration - durmin * 60)
      let curmin = Math.floor(this.audio.currentTime / 60)
      let cursec = Math.floor(this.audio.currentTime - curmin * 60)
      if (durmin < 10) {
        durmin = '0' + durmin
      }
      if (dursec < 10) {
        dursec = '0' + dursec
      }
      if (curmin < 10) {
        curmin = '0' + curmin
      }
      if (cursec < 10) {
        cursec = '0' + cursec
      }
      this.duration = durmin + ':' + dursec
      this.currentTime = curmin + ':' + cursec
    },
    updateBar (x) {
      const progress = this.$refs.progress
      const maxduration = this.audio.duration
      const position = x - progress.offsetLeft

      let percentage = (100 * position) / progress.offsetWidth
      if (percentage > 100) {
        percentage = 100
      }
      if (percentage < 0) {
        percentage = 0
      }
      this.barWidth = percentage + '%'
      this.circleLeft = percentage + '%'
      this.audio.currentTime = (maxduration * percentage) / 100
      this.audio.play()
    },
    clickProgress (e) {
      this.isTimerPlaying = true
      this.audio.pause()
      this.updateBar(e.pageX)
    },
    prevTrack (overrideTransaction = 'scale-in') {
      this.transitionName = overrideTransaction
      this.isShowCover = false
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex--
      } else {
        this.currentTrackIndex = this.tracks.length - 1
      }
      // this.currentTrack = this.tracks[this.currentTrackIndex]
      this.resetPlayer()
    },
    nextTrack (overrideTransaction = 'scale-out') {
      this.transitionName = overrideTransaction
      this.isShowCover = false
      if (this.currentTrackIndex < this.tracks.length - 1) {
        this.currentTrackIndex++
      } else {
        this.currentTrackIndex = 0
      }
      // this.currentTrack = this.tracks[this.currentTrackIndex]
      this.resetPlayer()
    },
    resetPlayer () {
      this.barWidth = 0
      this.circleLeft = 0
      this.audio.currentTime = 0
      this.audio.src = this.currentTrack.source
      this.mediaSessionSetMetadata()
      setTimeout(() => {
        if (this.isTimerPlaying) {
          this.audio.play()
        } else {
          this.audio.pause()
        }
      }, 300)
      this.$emit('track-changed', this.currentTrackIndex)
    },
    favorite () {
      this.$emit('track-favourite', this.currentTrackIndex)
    },
    mute () {
      this.muted = !this.muted
      if (!this.muted) this.audio.volume = this.volume / 100
      else this.audio.volume = 0
    },
    changeVolume (vol) {
      this.volume = vol
    },
    onPlaybackError () {
      this.$emit('popover-event', {
        message: '404, skip this track',
        description: `${this.currentTrack.artist ? `${this.currentTrack.artist} - ` : ''} ${this.currentTrack.name}`
      })
      this.nextTrack()
    },
    mediaSessionSetMetadata () {
      if (!this.currentTrack) return
      if (!this.currentTrack.sid) return
      if ('mediaSession' in navigator) {
        /* eslint-disable-next-line */
        navigator.mediaSession.metadata = new MediaMetadata({
          title: this.currentTrack.name || 'Unknown',
          artist: this.currentTrack.artist || 'Unknown',
          artwork: [
            { src: `https://b.ppy.sh/thumb/${this.currentTrack.sid}.jpg`, sizes: '80x60', type: 'image/png' },
            { src: `https://b.ppy.sh/thumb/${this.currentTrack.sid}l.jpg`, sizes: '160x120', type: 'image/png' },
            { src: this.currentTrack.cover }
          ].filter(({ src }) => src)
        })
      }
    },
    mediaSessionSetPosition () {
      if ('mediaSession' in navigator && 'mediaSessionSetPositionState' in navigator.mediaSession) {
        navigator.mediaSession.mediaSessionSetPositionState(this.audio)
      }
    }
  },
  created () {
    const vm = this
    // this.currentTrack = this.tracks[0]
    this.audio = new Audio()
    this.audio.src = this.currentTrack.source
    this.audio.volume = this.volume / 100
    this.audio.ontimeupdate = function () {
      vm.generateTime()
    }
    this.audio.onloadedmetadata = function () {
      vm.mediaSessionSetMetadata()
      vm.generateTime()
    }
    this.audio.onended = function () {
      vm.nextTrack()
      vm.isTimerPlaying = true
    }
    this.audio.onerror = (err) => {
      this.onPlaybackError(err)
    }

    // this is optional (for preload covers)
    // for (let index = 0; index < this.tracks.length; index++) {
    //   const element = this.tracks[index]
    //   const link = document.createElement('link')
    //   link.rel = 'prefetch'
    //   link.href = element.cover
    //   link.as = 'image'
    //   document.head.appendChild(link)
    // }

    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', function () {
        vm.play()
      })
      navigator.mediaSession.setActionHandler('pause', function () {
        vm.play()
      })
      // navigator.mediaSession.setActionHandler('seekbackward', function () {})
      // navigator.mediaSession.setActionHandler('seekforward', function () {})
      navigator.mediaSession.setActionHandler('seekto', (detail) => {
        this.audio.currentTime = detail.seekTime
      })
      navigator.mediaSession.setActionHandler('previoustrack', function () {
        vm.prevTrack()
      })
      navigator.mediaSession.setActionHandler('nexttrack', function () {
        vm.nextTrack()
      })
    }
    // this.mediaSessionSetMetadata()
  }
}
</script>
