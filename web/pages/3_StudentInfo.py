import streamlit as st
import os
import pandas as pd

st.markdown("""
    <style>
    .title {
        font-size: 36px;
        font-weight: bold;
        color: #1E3A8A; /* Dark Blue */
        margin-bottom: 20px;
    }
    table {
        font-size: 18px;
        margin: 20px 0;
        border-collapse: collapse;
    }
    th {
        background-color: #1E3A8A; /* Dark Blue */
        color: white;
        padding: 10px;
    }
    td {
        padding: 10px;
        border-bottom: 1px solid #ddd;
    }
    </style>
""", unsafe_allow_html=True)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
DATA_DIR = os.path.join(BASE_DIR, 'data')

def load_student_info():
    try:
        with open(os.path.join(DATA_DIR, 'student_info.txt'), 'r') as file:
            data = file.readlines()
        return data
    except FileNotFoundError:
        return [f"Error: student_info.txt not found at {os.path.join(DATA_DIR, 'student_info.txt')}"]

st.markdown('<div class="title">Student Information</div>', unsafe_allow_html=True)

student_info = load_student_info()

data = []
for line in student_info:
    student_info = line.strip().split(' | ')
    if len(student_info) == 8:
        student_id, first_name, last_name, email, course, grade_type, percentage, note = student_info
        data.append({
            "Student ID": student_id,
            "First Name": first_name,
            "Last Name": last_name,
            "Email": email,
            "Course": course,
            "Grade Type": grade_type,
            "Percentage": percentage,
            "Note": note
        })

if data:
    df = pd.DataFrame(data)
    df.index = range(1, len(df) + 1)
    st.table(df)
else:
    st.error("No data to display.")
