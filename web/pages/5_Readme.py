import streamlit as st
import os

# TODO: fix text color and styling of this page

st.markdown("""
    <style>
    .title {
        font-size: 36px;
        font-weight: bold;
        color: #1E3A8A; /* Dark Blue */
        margin-bottom: 20px;
    }
    .content {
        font-size: 18px;
        line-height: 1.6;
        color: #333;
    }
    </style>
""", unsafe_allow_html=True)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

def load_readme():
    readme_path = os.path.join(BASE_DIR, 'README.md')
    try:
        with open(readme_path, 'r') as file:
            content = file.read()
        return content
    except FileNotFoundError:
        return "README.md file not found."

st.markdown('<div class="title">README.md</div>', unsafe_allow_html=True)

readme_content = load_readme()

if readme_content:
    st.markdown(f'<div class="content">{readme_content}</div>', unsafe_allow_html=True)
else:
    st.error("No README.md content to display.")
