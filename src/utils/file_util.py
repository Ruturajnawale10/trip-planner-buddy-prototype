

def write_string_to_file(filename, content):
    # Open the file in 'a' (append) mode, which will create the file if it doesn't exist
    with open(filename, 'a', encoding='utf-8') as file:
        # Write the content to the file followed by a newline character
        file.write(content + '\n')