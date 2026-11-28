process.stdout.write("Application started.\n");

process.stderr.write("Warning: Configuration is missing.\n");

process.stdout.write("Application completed.\n");

// Both streams may appear together in the terminal.

// However, they remain separate streams with separate file descriptors.

// This distinction becomes clearer when we redirect them independently.
