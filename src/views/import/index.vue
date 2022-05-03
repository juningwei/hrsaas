<template>
  <upload-excel :on-success="success"></upload-excel>
</template>

<script>
export default {
  methods: {
      success({ header, results }) {
      console.log(header);
      console.log(results);

      debugger
    }
  },
}
</script>