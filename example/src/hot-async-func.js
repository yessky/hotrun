module.exports = async () => {
  console.log('hot-async-func');
  await new Promise((resolve) => {
    setTimeout(() => resolve(), 300)
  })
};