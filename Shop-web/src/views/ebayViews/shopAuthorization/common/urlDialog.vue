<template>
	<div>
		<span>{{loginUrl}}</span>
	</div>
</template>

<script>
	export default {
		props: ["params"],
		data() {
			return {
				loginUrl: '',
			};
		},
		methods: {
			_initData() {

				this.loginUrl = this.params.url

			},
		},
		created() {

		}
	};
</script>

<style>
</style>
