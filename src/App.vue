<template>
    <div class="g">
        <h1>Minesweeper</h1>
        <div v-for="(row,y) in state" :key="y" class="c">
            <button class="btn" v-for="(block,x) in row" :key="x" @click="onClick(block)" :class="getBlockClass(block)"
            @contextmenu.prevent="onRightClick(block)">
                <template v-if="block.flagged">
                    <el-icon size="10px" color="red"><check /></el-icon>
                </template>
                <template v-else-if="block.revealed || dev">
                    <template v-if="block.mine">
                        <el-icon size="10px" color="red"><close /></el-icon>
                    </template>
                    <div v-else-if="block.adjacentMines > 0">
                        {{block.adjacentMines}}
                    </div>
                </template>
            </button>
        </div>
    </div>
</template>

<script setup>
import {ref,watchEffect} from 'vue'
const WIDTH = 5
const HEIGHT = 5
let mineGenerated  = false
const dev = false
const state = ref(
    Array.from({length: HEIGHT},(_,y)=>
        Array.from({length: WIDTH},
            (_, x) => ({
                x,
                y,
                adjacentMines:0,
                mine:false,
                revealed:false,
                flagged:false
            }),
        )
    )
)
const directions = [
    [1,1],
    [1,0],
    [1,-1],
    [0,-1],
    [-1,-1],
    [-1,0],
    [-1,1],
    [0,1]
]
function updateNumbers(){
    state.value.forEach((raw,y) => {
        raw.forEach((block,x) => {
            if (block.mine) {
                return
            }
            getSiblings(block)
                .forEach(b => {
                    if (b.mine)
                        block.adjacentMines += 1
                })
            // directions.forEach(([dx,dy]) => {
            //     const x2 = x + dx
            //     const y2 = y + dy
            //     if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT){
            //         return
            //     }
            //     if (state[y2][x2].mine){
            //         block.adjacentMines += 1
            //     }
            // })
            })
    })
}
function getSiblings(block){
    return directions.map(([dx,dy]) => {
        const x2 = block.x + dx;
        const y2 = block.y + dy;
        if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT){
            return undefined
        }
        return state.value[y2][x2]
    })
    .filter(Boolean)
}
function expendZero(block){
    if (block.adjacentMines){
        return
    }
    getSiblings(block).forEach((s) => {
        if (!s.revealed) {
            s.revealed = true
            expendZero(s)
        }

    })
}

function generateMines(initial){
    for(const row of state.value){
        for(const block of row){
            if(Math.abs(initial.x - block.x) <= 1){
                continue
            }
            if(Math.abs(initial.y - block.y) <= 1){
                continue
            }
            block.mine = Math.random() < 0.3;
        }
    }
    updateNumbers()
}
function onRightClick(block){
    if (block.revealed){
        return
    }
    block.flagged = !block.flagged
}
function onClick(block) {
    if (!mineGenerated){
        generateMines(block)
        mineGenerated = true
    }
    block.revealed = true
    setTimeout(()=>{
        if(block.mine) {
            alert("BOOM!")
        }
    },400)
    expendZero(block)
}
function getBlockClass(block){
    if(!block.revealed || block.flagged){
        return "h"
    }
    return block.mine ? 'text-red': 'text-gray'
}
watchEffect(() => {
    checkGameState()
    console.log("mine是否已经产生",mineGenerated)
})
function checkGameState(){
    const blocks = state.value.flat()
    let flag = false
    if(blocks.every(block => block.revealed || (block.mine && block.flagged))){
        if(blocks.some(block => !block.mine && block.flagged)){
            flag = false
        }else{
            flag = true
        }
    }
    if(flag){
        setTimeout(()=>{
            alert("You Win!")
        },400)
    }
}
</script>



<style scoped>
    .g{
        positon: absolute;
        left: 50%;
        top: 60%;
    }
.btn{
    width: 30px;
    height: 30px;
    border: 1px solid #baccb1;
    margin: 0px;
    padding: 0px;
    background: white;
}
.c{
    margin: 0px;
    padding: 0px;
    display: flex;
    item-align: center;
}
.text-red{
    border: 1px solid red;
}
.text-gray{
    border: 1px solid gray;
}
.h{

}
.h:hover{
    background: grey;
    opacity: 0.6;
}
</style>
