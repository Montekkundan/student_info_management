import configparser
import sys
import os
from collections import defaultdict

def calculate_gpa(assignments, midterm, project, final):
    """Calculates GPA based on provided weights."""
    return 0.3 * assignments + 0.2 * midterm + 0.2 * project + 0.3 * final

def get_letter_grade(gpa):
    """Converts GPA to letter grade."""
    if gpa >= 90:
        return "A+"
    elif 85 <= gpa < 90:
        return "A"
    elif 80 <= gpa < 85:
        return "A-"
    elif 77 <= gpa < 80:
        return "B+"
    elif 73 <= gpa < 77:
        return "B"
    elif 70 <= gpa < 73:
        return "B-"
    elif 67 <= gpa < 70:
        return "C+"
    elif 63 <= gpa < 67:
        return "C"
    elif 60 <= gpa < 63:
        return "C-"
    elif 50 <= gpa < 60:
        return "D"
    else:
        return "F"

def generate_weekly_summary(student_info_file, output_file, week=None):
    """Generates the student summary with GPA, letter grades, and attendance summary."""
    student_data = defaultdict(lambda: {
        "assignments": 0,
        "assignments_count": 0,
        "midterm": 0,
        "project": 0,
        "final": 0,
        "attendance_count": 0,
        "attendance_present": 0
    })

    inside_week_data = False

    try:
        with open(student_info_file, 'r') as infile:
            for line in infile:
                if week is not None:
                    if f"============Week {week}============" in line:
                        inside_week_data = True
                        print(f"Processing Week {week}...")
                        continue
                    elif "============" in line:
                        inside_week_data = False

                if week is None or inside_week_data:
                    data = line.split(' | ')
                    # if len(data) < 8:
                    #     continue
                    student_id,course, grade_type, percentage, note = data[:5]

                    if grade_type == 'attendance':
                        student_data[student_id]["attendance_count"] += 1
                        if 'y' in note:
                            student_data[student_id]["attendance_present"] += 1
                    else:
                        percentage = float(percentage)
                        if grade_type == 'assignment':
                            student_data[student_id]["assignments"] += percentage
                            student_data[student_id]["assignments_count"] += 1
                        elif grade_type == 'midterm':
                            student_data[student_id]["midterm"] = percentage
                        elif grade_type == 'project':
                            student_data[student_id]["project"] = percentage
                        elif grade_type == 'final':
                            student_data[student_id]["final"] = percentage

        os.makedirs(os.path.dirname(output_file), exist_ok=True)

        with open(output_file, 'w') as outfile:
            for student_id, grades in student_data.items():
                # print(f"Processing student_id: {student_id}, grades: {grades}")
                if not (grades["assignments_count"] or grades["midterm"] or grades["project"] or grades["final"]):
                    attendance_rate = (grades["attendance_present"] / grades["attendance_count"]) * 100 if grades["attendance_count"] > 0 else 0
                    outfile.write(f"{student_id} | Attendance: {attendance_rate:.2f}%\n")
                    continue

                if grades["assignments_count"] > 0:
                    avg_assignments = grades["assignments"] / grades["assignments_count"]
                else:
                    avg_assignments = 0

                # Calculate GPA
                gpa = calculate_gpa(avg_assignments, grades["midterm"], grades["project"], grades["final"])
                letter_grade = get_letter_grade(gpa)
                print(f"student_id: {student_id}, gpa: {gpa}, letter_grade: {letter_grade}")

                # Write GPA summary
                outfile.write(f"{student_id} | GPA: {gpa:.2f} | Grade: {letter_grade}\n")

        print(f"Summary generated in {output_file}")

    except FileNotFoundError:
        print(f"Error: {student_info_file} not found.")
        sys.exit(1)



def generate_final_summary(student_info_file, output_file):
    """Generates the final student summary with GPA, letter grades, and attendance summary."""
    student_data = defaultdict(lambda: {
        "assignments": [],
        "midterm": None,
        "project": None,
        "final": None,
        "attendance_count": 0,
        "attendance_present": 0
    })

    try:
        with open(student_info_file, 'r') as infile:
            for line in infile:
                if "email_address" in line or line.startswith("student_id"):
                    continue
            
                data = line.split(' | ')
                if len(data) < 8:
                    continue

                student_id, first_name, last_name, email, course, grade_type, percentage, note = data

                if grade_type == 'attendance':
                    student_data[student_id]["attendance_count"] += 1
                    if 'y' in note:
                        student_data[student_id]["attendance_present"] += 1
                else:
                    percentage = float(percentage)
                    if grade_type == 'assignment':
                        student_data[student_id]["assignments"].append(percentage)
                    elif grade_type == 'midterm':
                        student_data[student_id]["midterm"] = percentage
                    elif grade_type == 'project':
                        student_data[student_id]["project"] = percentage
                    elif grade_type == 'final':
                        student_data[student_id]["final"] = percentage

        os.makedirs(os.path.dirname(output_file), exist_ok=True)

        with open(output_file, 'w') as outfile:
            outfile.write(f"student_id | course | assignment_id | midterm | project | final | GPA | Grade\n")
            for student_id, grades in student_data.items():
                if len(grades["assignments"]) > 0:
                    avg_assignments = sum(grades["assignments"]) / len(grades["assignments"])
                else:
                    avg_assignments = 0

                # Calculate GPA based on available data
                gpa = calculate_gpa(
                    avg_assignments,
                    grades["midterm"] if grades["midterm"] else 0,
                    grades["project"] if grades["project"] else 0,
                    grades["final"] if grades["final"] else 0
                )
                letter_grade = get_letter_grade(gpa)

                assignments_detail = ', '.join([f'{i+1}: {a}' for i, a in enumerate(grades["assignments"])])
                outfile.write(f"{student_id} | {course} | {assignments_detail} | {grades['midterm'] or 'N/A'} | {grades['project'] or 'N/A'} | {grades['final'] or 'N/A'} | {gpa:.2f} | {letter_grade}\n")

        print(f"Summary generated in {output_file}")

    except FileNotFoundError:
        print(f"Error: {student_info_file} not found.")
        sys.exit(1)
if __name__ == "__main__":
    config = configparser.ConfigParser()
    config.read('config/student_management.cfg')

    student_info_file = config.get('DEFAULT', 'student_info_file', fallback='data/student_info.txt')
    output_file = config.get('DEFAULT', 'summary_output_file', fallback='data/student_summary.txt')

    generate_final_summary(student_info_file, output_file)
