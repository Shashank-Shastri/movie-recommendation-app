<template>
    <div id="error">
        <div class="moon"></div>
        <div :class="i" v-for="i in moonCraters" :key="i"></div>
        <div class="star" :style="i" v-for="i in randomStars" :key="i"></div>

        <div class="error">
        <div class="error__title">404</div>
        <div class="error__subtitle">Hmmm...</div>
        <div class="error__description">It looks like you are lost in exploration</div>
        <router-link :to="{ name: 'Home' }"><button class="error__button">Home</button></router-link>
        </div>

        <div class="astronaut">
            <div :class="i" v-for="i in astronaut" :key="i"></div>
            
            <div class="astronaut__cord">
                <canvas id="cord" height="500px" width="500px"></canvas>
            </div>
            
            <div class="astronaut__head">
                <canvas id="visor" width="60px" height="60px"></canvas>
                <div class="astronaut__head-visor-flare1"></div>
                <div class="astronaut__head-visor-flare2"></div>
            </div>
        </div>
    </div>
</template>

<script>
let y1 = 160;
let y2 = 100;
let y3 = 100;

let y1Forward = true;
let y2Forward = false;
let y3Forward = true;

let cordCanvas = document.getElementById('cord');
let ctx = cordCanvas?.getContext('2d');

export default {
    data() {
        return {
            astronaut: [
                'astronaut__backpack',
                'astronaut__body',
                'astronaut__body__chest',
                'astronaut__arm-left1',
                'astronaut__arm-left2',
                'astronaut__arm-right1',
                'astronaut__arm-right2',
                'astronaut__arm-thumb-left',
                'astronaut__arm-thumb-right',
                'astronaut__leg-left',
                'astronaut__leg-right',
                'astronaut__foot-left',
                'astronaut__foot-right',
                'astronaut__wrist-left',
                'astronaut__wrist-right'
            ],
            moonCraters: [],
            randomStars: []
        }
    },
    beforeMount() {
        for(let i = 1; i <= 3; i++) this.moonCraters.push(`moon__crater moon__crater${i}`);
        for(let i = 1; i <= 100; i++) {
            this.randomStars.push(`animation: twinkle ${Math.random() * 5 + 5}s linear ${Math.random() * 5 + 5}s infinite; top: ${Math.random() * screen.height}px; left: ${Math.random() * screen.width}px;`);
        }
    },
    mounted() {
        const visorCanvas = document.getElementById('visor');
        cordCanvas = document.getElementById('cord');
        ctx = cordCanvas?.getContext('2d');
        this.drawVisor(visorCanvas.getContext('2d'));
        this.animate();
    },
    methods: {
        drawVisor(ctx) {
            ctx.beginPath();
            ctx.moveTo(5, 45);
            ctx.bezierCurveTo(15, 64, 45, 64, 55, 45);
            
            ctx.lineTo(55, 20);
            ctx.bezierCurveTo(55, 15, 50, 10, 45, 10);
            
            ctx.lineTo(15, 10);
            
            ctx.bezierCurveTo(15, 10, 5, 10, 5, 20);
            ctx.lineTo(5, 45);
            
            ctx.fillStyle = '#2f3640';
            ctx.strokeStyle = '#f5f6fa';
            ctx.fill();
            ctx.stroke();
        },
        animate() {
            requestAnimationFrame(this.animate);

            ctx.clearRect(0, 0, innerWidth, innerHeight);
        
            ctx.beginPath();
            ctx.moveTo(130, 170);

            if(window.matchMedia('(max-width: 400px)').matches) { 
                ctx.bezierCurveTo(250, y1, 300, y2, 310, y3);
            } else{
                ctx.bezierCurveTo(250, y1, 345, y2, 400, y3);
            }
            
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 8;
            ctx.stroke();
        
            
            if (y1 === 100) {
                y1Forward = true;
            }
            
            if (y1 === 300) {
                y1Forward = false;
            }
            
            if (y2 === 100) {
                y2Forward = true;
            }
            
            if (y2 === 310) {
                y2Forward = false;
            }
            
            if (y3 === 100) {
                y3Forward = true;
            }
            
            if (y3 === 317) {
                y3Forward = false;
            }
            
            y1Forward ? y1 += 1 : y1 -= 1;
            y2Forward ? y2 += 1 : y2 -= 1;
            y3Forward ? y3 += 1 : y3 -= 1;
        }
    }
};

</script>

<style>
    @import './animation.css'
</style>
