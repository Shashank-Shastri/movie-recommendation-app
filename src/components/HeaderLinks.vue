<template>
    <div>
        <router-link :to="{ name: 'HomePage' }"
            ><img src="/assets/favicon.png"
        /></router-link>
        <div id="nav">
            <router-link :to="{ name: 'HomePage' }">Home</router-link> |
            <router-link :to="{ name: 'AboutPage' }">About</router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HeaderLinks',
};
</script>
