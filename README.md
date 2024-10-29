# Student Information Management System

This project implements a student information management system using Python, designed to process student information from various input files, simulate data, generate weekly summaries, and manage configurations. The project follows a modular structure, handling different tasks like file parsing, simulation, summary generation, and more.


# Clone it from Github

```bash
git clone https://github.com/Montekkundan/student_info_management.git
```

## Prerequisites

Make sure you have Python installed (version 3.6 or above). You can install any necessary libraries by running:


create a virtual environment and activate it:

```bass
python -m venv venv
```

then source it 

```bash
source venv/bin/activate
```

then pip install


```bash
pip install -r requirements.txt  # if needed
```


## Managing the "teacher" Group in Linux

To ensure that only users in the "teacher" group can run the student information management system, you'll need to create and manage this group in your Linux environment.

### 1. Create the "teacher" Group

To create a new user group named "teacher", use the following command:

```bash
sudo groupadd teacher
```

### 2. Add a User to the "teacher" Group

To add a user to the "teacher" group, use the following command (replace `username` with the actual username):

```bash
sudo usermod -aG teacher username
```

You can check if the user has been successfully added to the group by running:

```bash
groups username
```

**Check Current User's Groups**

To check which groups the current user belongs to, you can use the `groups` command along with `whoami` to get the current username:

```bash
groups $(whoami)
```

This will list all the groups that the current user is a member of.

*Note: The user will need to log out and log back in for the group change to take effect.*

### 3. Remove a User from the "teacher" Group

To remove a user from the "teacher" group, use the following command:

```bash
sudo gpasswd -d username teacher
```

This will remove the user from the "teacher" group, and the change will take effect immediately.

### 4. Delete the "teacher" Group

To delete the "teacher" group entirely, use the following command:

```bash
sudo groupdel teacher
```

*Note: Make sure no important users rely on this group before deletion.*

## How to Use the Makefile

### Run the Project Manually

To run your main script using the configuration file, use the following command:

```bash
make run
```

### Clean Generated Files

To delete all generated files like `basic_info.txt`, `academic_info.txt`, `student_info.txt`, and `student_summary.txt` from the `data/` directory, use:

```bash
make clean
```

### Simulate Academic Data

To run the simulation and generate academic data in `academic_info.txt`, use:

```bash
make simulate
```

### Generate Weekly Summary

To generate a weekly student summary and store it in `student_summary.txt`, use:

```bash
make summary
```

### Reset the Project

To clean all generated files, essentially resetting the project to its initial state, use:

```bash
make reset
```
```


### Show Help

To display all available commands and their descriptions, use:

```bash
make help
```


## How to Run the Project

### Generate basic_info.txt from student_list_orig.txt

The first step is to convert the provided `student_list_orig.txt` into `basic_info.txt`.

```bash
python student_info_manager.py --generate-basic-info
```

This will read from `student_list_orig.txt` and output `basic_info.txt` in the format:

```plaintext
student_id | first_name | last_name | email_address
```

### Simulate New Student Academic Information

You can simulate new academic data either hourly or manually by running the simulation script:

```bash
python simulation.py --simulate
```

This will append new academic info to `academic_info.txt` in the following format:

```plaintext
student_id | course | grade_type | percentage | note
```

### Merge Basic and Academic Info

After gathering both basic and academic information, the following command will merge them into `student_info.txt`:

```bash
python student_info_manager.py --merge-info
```

This will create `student_info.txt` in the format:

```plaintext
student_id | first_name | last_name | email_address | course | grade_type | percentage | note
```

### Generate Weekly Summary

You can generate a summary of student academic performance and GPA calculation. You can run this weekly or manually using the command:

```bash
python generate_summary.py --generate-summary
```

The summary will be saved in `student_summary.txt`, including sorted student info and GPA based on the provided formula.

#### GPA Calculation

GPA = 30% * (total percentage of assignments) + 20% (percentage of project) + 20% (percentage of midterm) + 30% (percentage of final)

The summary will also include letter grades (e.g., A+, A, B, etc.) based on GPA ranges.

### Configuration Management

The project uses a configuration file `student_management.cfg` to set paths, GPA formulas, and simulation settings. The configuration can also be overridden via command-line arguments.

Example:

```bash
python student_info_manager.py --config custom_config.cfg
```

### Access Control

Ensure that only users in the "teacher" user group can run this script. To manage access, you can set up system-level group permissions for the script.

### Usage Statement

Run the following command to see detailed usage instructions, examples, and expected outputs:

```bash
python student_info_manager.py --help
```


## Project Structure

```plaintext
student_info_management/
│
├── README.md                
├── Makefile                 
├── config/
│   ├── student_management.cfg   
├── data/
│   ├── student_list_orig.txt    
│   ├── basic_info.txt           
│   ├── academic_info.txt        
│   ├── student_info.txt         
│   └── student_summary.txt      
├── src/
│   ├── student_info_manager.py  
│   ├── simulation.py            
│   ├── config_handler.py        
│   └── generate_summary.py      
├── web/
        

```

## Pm2

```bash
pm2 start 'bun run start' --name nextjs
```

delete the app

```bash
pm2 delete nextjs-app
```

## Restart Nginx

```bash
sudo systemctl restart nginx
```