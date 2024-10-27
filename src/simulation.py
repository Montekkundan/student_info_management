import argparse
import random
import time
import os
import sys
import configparser
import grp

import generate_summary

config = configparser.ConfigParser()
config.read('student_management.cfg')

def check_user_group():
    """Check if the current user belongs to the 'teacher' group."""
    try:
        teacher_group = grp.getgrnam('teacher').gr_gid
    except KeyError:
        print("Error: 'teacher' group does not exist on this system.")
        sys.exit(3)

    user_groups = os.getgroups()

    if teacher_group not in user_groups:
        print("Error: You do not have permission to run this program. Only users in the 'teacher' group can run it.")
        sys.exit(3)

def load_students_from_basic_info(basic_info_file):
    """Load all student IDs from the basic_info.txt file."""
    students = []
    try:
        with open(basic_info_file, 'r') as file:
            for line in file:
                student_id = line.strip().split(' | ')[0]  # Extract student_id from each line
                students.append(student_id)
    except IOError as e:
        print(f"Error reading from {basic_info_file}: {str(e)}")
        sys.exit(1)

    return students

def simulate_academic_data(output_file, basic_info_file, weeks_in_semester=12, manual_run=False):
    """Simulates academic data generation for a full semester and writes to academic_info.txt."""
    students = load_students_from_basic_info(basic_info_file)
    courses = ["COMP101"]
    
    week = 1
    while week <= weeks_in_semester:
        try:
            print(f"Starting Week {week}...")
            
            with open(output_file, 'a') as file:
                file.write(f"============Week {week}============\n")

            for student_id in students:
                course = random.choice(courses)
                
                attendance_id = week
                attendance_status = 'y' if random.choice([True, False]) else 'n'
                note = f"{attendance_id}|{attendance_status}"
                with open(output_file, 'a') as file:
                    file.write(f"{student_id} | {course} | attendance | 100 | {note}\n")

                # Week-specific simulation
                if week == 1:
                    percentage = random.randint(50, 100)
                    with open(output_file, 'a') as file:
                        file.write(f"{student_id} | {course} | assignment | {percentage} | 1\n")

                if week == 4:
                    percentage = random.randint(50, 100)
                    with open(output_file, 'a') as file:
                        file.write(f"{student_id} | {course} | assignment | {percentage} | 2\n")

                if week == 6:
                    percentage = random.randint(50, 100)
                    with open(output_file, 'a') as file:
                        file.write(f"{student_id} | {course} | midterm | {percentage} | \n")

                if week == 10:
                    percentage = random.randint(50, 100)
                    with open(output_file, 'a') as file:
                        file.write(f"{student_id} | {course} | project | {percentage} | \n")

                if week == 12:
                    percentage = random.randint(50, 100)
                    with open(output_file, 'a') as file:
                        file.write(f"{student_id} | {course} | final | {percentage} | \n")

            #  weekly summary
            weekly_summary_file = f"data/summary/student_summary_week_{week}.txt"
            # print(f"-----------------{output_file} ----- {weekly_summary_file} ----------- {week}.")
            generate_summary.generate_summary(output_file, weekly_summary_file, week=week)  
            
            week += 1

            if manual_run:
                break
            else:
                time.sleep(1)

        except IOError as e:
            print(f"Error writing to file {output_file}: {str(e)}")
            sys.exit(1)

    print("Semester finished.")


def main():
    check_user_group()

    parser = argparse.ArgumentParser(description="Simulate academic data generation for students.")
    parser.add_argument('--simulate', action='store_true', help="Run academic data simulation")
    parser.add_argument('--config', help="Override the default configuration file")
    
    args = parser.parse_args()

    if args.config:
        config.read(args.config)

    academic_info_file = config.get('DEFAULT', 'academic_info_file', fallback='academic_info.txt')
    basic_info_file = config.get('DEFAULT', 'basic_info_file', fallback='basic_info.txt')

    if args.simulate:
        simulate_academic_data(academic_info_file, basic_info_file, weeks_in_semester=12, manual_run=False)
    else:
        print("Use --simulate to run the simulation.")
        print_usage()

def print_usage():
    """Prints detailed usage instructions."""
    print("""
    Usage: python simulation.py [OPTIONS]

    Options:
    --simulate              Run academic data simulation and generate data for a full semester.
    --config <path>         Override the default configuration file.

    Example:
    python simulation.py --simulate --config custom_config.cfg

    This script generates academic data for students and appends it to the academic_info.txt file.
    You can run the script in semester mode or manually generate a single week's entry.
    """)

if __name__ == "__main__":
    main()
