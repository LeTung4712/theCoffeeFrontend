<template>
    <div>
        <userHeader/>
        <div>
        <userInfo/>
        </div>
        <!-- <mainHeader/> -->
    </div>
</template>

<script>

export default {
   name: "UserPage",

   components: {
    userHeader: () => import("@/layouts/header/userHeader"),
    userInfo: () => import("@/components/userComponents/userInfo")
  },
}
</script>
