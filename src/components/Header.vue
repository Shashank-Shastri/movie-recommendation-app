<template>
    <div id="nav">
        <router-link :to="{ name: 'Home' }">Home</router-link> |
        <router-link :to="{ name: 'About' }">About</router-link>
    </div>
</template>

<script>
export default {
    name: 'Header'
};
</script>
