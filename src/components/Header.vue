<template>
    <div>
        <router-link :to="{ name: 'Home' }"
            ><img src="/assets/favicon.png"
        /></router-link>
        <div id="nav">
            <router-link :to="{ name: 'Home' }">Home</router-link> |
            <router-link :to="{ name: 'About' }">About</router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Header',
};
</script>
