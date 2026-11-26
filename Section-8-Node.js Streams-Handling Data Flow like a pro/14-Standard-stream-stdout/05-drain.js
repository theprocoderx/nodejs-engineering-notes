if (!process.stdout.write("Hello\n")) {
  process.stdout.once("drain", () => {
    console.log("Ready for more writes.");
  });
}
