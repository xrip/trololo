<template>
  <div  @click="showDetails" class="card" draggable="true" @drop="onDrop" @dragstart="onDragStart" @dragover.prevent>
    <div class="close-button" @click.stop="removeCardFromList">
      x
    </div>
    <div class="body">
      {{ title }}
    </div>
    <div class="arrows">
      <div :class="['arrow', 'left', movableToLeft ? '' : 'disabled']" @click.stop="moveCardToLeft">
        ←
      </div>
      <div :class="['arrow', 'right', movableToRight ? '' : 'disabled']" @click.stop="moveCardToRight">
        →
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import * as types from '../store/mutation-types.js';

const Card = {
  props: ['title', 'index'],
  computed: {
    movableToLeft() {
      return this.$parent.index > 0;
    },
    movableToRight() {
      return this.listsCount > this.$parent.index + 1;
    },
    ...mapGetters([
      'listsCount'
    ])
  },
  methods: {
    showDetails() {
      this.$root.$emit('showCardDetails', {listIndex: this.$parent.index, cardIndex: this.index});
    },
    removeCardFromList() {
      if (confirm('Are you sure?'))
      this.$store.commit(types.REMOVE_CARD_FROM_LIST, {
        from: this.$parent.index,
        cardIndex: this.index
      });
    },
    moveCardToRight() {
      if(this.movableToRight) {
        this.moveCardToList({
          from: {
            listIndex: this.$parent.index,
            cardIndex: this.index
          },
          to: {
            listIndex: this.$parent.index + 1,
            cardIndex: null
          }
        });
      }
    },
    moveCardToLeft() {
      if(this.movableToLeft) {
        this.moveCardToList({
          from: {
            listIndex: this.$parent.index,
            cardIndex: this.index
          },
          to: {
            listIndex: this.$parent.index - 1,
            cardIndex: null
          }
        });
      }
    },
    onDragStart({dataTransfer}) {
      dataTransfer.setData("application/json", JSON.stringify({
        source: 'card',
        from: {
          listIndex: this.$parent.index,
          cardIndex: this.index
        }
      }));
      event.stopPropagation();
    },

    onDrop(event) {
      const { source, from } = JSON.parse(event.dataTransfer.getData("application/json"));

      if (source !== 'card') return;

      const to = {
        listIndex: this.$parent.index,
        cardIndex: this.index
      };
      this.moveCardToList({ from, to });

      event.stopPropagation();
    },
    ...mapMutations({
      moveCardToList: types.MOVE_CARD_TO_LIST,

    })
  }
};

export default Card;
</script>

<style lang="scss" scoped>
.card {
  margin-bottom: 15px;
  position: relative;
  display: flex;
  align-items: center;
  padding: 30px 15px 40px;
  background-color: #fff;
  border-radius: 8px;
  width: calc(100% - 30px);
  cursor: pointer;

  .close-button {
    position: absolute;
    top: 6px;
    right: 15px;
    font-size: 22px;
    cursor: pointer;
  }

  .close-button:hover {
    opacity: 0.8;
  }

  .body {
    font-size: 18px;
    width: 100%;
    word-wrap: break-word;
  }

  .arrows {
    display: flex;
    justify-content: space-between;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;

    .arrow {
      margin: 10px;
      font-size: 18px;
      color: #FF003F;
      cursor: pointer;
    }

    .arrow:hover {
      opacity: 0.8;
    }

    .arrow.disabled {
      color: #999;
      pointer-events: none;
    }
  }
}

.card:last-child {
  margin-bottom: 0;
}
</style>
