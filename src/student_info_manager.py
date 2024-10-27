import sys
from config_handler import ConfigHandler

def generate_basic_info(student_list_file, output_file):
    """Generates basic_info.txt from student_list_orig.txt."""
    try:
        with open(student_list_file, 'r') as infile, open(output_file, 'w') as outfile:
            for line in infile:
                data = line.split()
                student_id, first_name, last_name, email = data[0], data[1], data[2], data[3]
                outfile.write(f"{student_id} | {first_name} | {last_name} | {email}\n")
        print(f"Generated {output_file}")
    except FileNotFoundError:
        print(f"Error: {student_list_file} not found.")
        sys.exit(1)

def merge_info(basic_info_file, academic_info_file, output_file):
    """Merges basic info and academic info into student_info.txt."""
    try:
        with open(basic_info_file, 'r') as basic_file, open(academic_info_file, 'r') as academic_file, open(output_file, 'w') as outfile:
            basic_data = {line.split(' | ')[0]: line.strip() for line in basic_file}
            for line in academic_file:
                data = line.split(' | ')
                student_id = data[0]
                if student_id in basic_data:
                    outfile.write(f"{basic_data[student_id]} | {' | '.join(data[1:])}")
        print(f"Merged info into {output_file}")
    except FileNotFoundError as e:
        print(f"Error: {e.filename} not found.")
        sys.exit(1)

def main():
    config_handler = ConfigHandler('config/student_management.cfg')
    
    if '--generate-basic-info' in sys.argv:
        student_list_file = config_handler.get('student_list_file')
        print('hello student_list_file:', student_list_file)
        output_file = config_handler.get('basic_info_file') 
        generate_basic_info(student_list_file, output_file)
    
    if '--merge-info' in sys.argv:
        basic_info_file = config_handler.get('basic_info_file')
        academic_info_file = config_handler.get('academic_info_file')
        output_file = config_handler.get('student_info_file')
        merge_info(basic_info_file, academic_info_file, output_file)
    
    if '--help' in sys.argv:
        print_usage()

def print_usage():
    """Prints usage instructions."""
    print("""
    Usage: python student_info_manager.py [OPTIONS]
    
    Options:
    --generate-basic-info    Generate basic_info.txt from student_list_orig.txt
    --merge-info             Merge basic_info.txt and academic_info.txt into student_info.txt
    --help                   Show this message
    """)

if __name__ == "__main__":
    main()
