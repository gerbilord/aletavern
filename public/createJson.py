import os
import json

json_file_name = "card_details.json"
master_json_file_name = "directory_details.json"
default_count = 1

directory_details = []

def get_folders(current_directory):
    folders = []
    for dirname, dirnames, filenames in os.walk(current_directory):


        for subdirname in dirnames:
            folders.append(os.path.join(dirname, subdirname))

        # Stop traversal
        del dirnames[:]
    return folders


def get_files(current_directory):
    files = []
    for dirname, dirnames, filenames in os.walk(current_directory):

        for filename in filenames:
            files.append(os.path.join(dirname, filename))

        # Stop traversal
        del dirnames[:]
    return files


def write_json(json_file_path, json_file_name, json_data):
    with open(os.path.join(json_file_path, json_file_name), 'w') as json_file:
        json.dump(json_data, json_file, indent=4)


def make_json_files(current_directory):
    current_folders = get_folders(current_directory)
    current_files = get_files(current_directory)

    safe_delete(os.path.join(current_directory, json_file_name), current_files)
    safe_delete(os.path.join(current_directory, master_json_file_name), current_files)

    if len(current_files) > 0 and current_directory != '.':
        card_details = []
        directory_details.append(json_join(current_directory, json_file_name))
        card_details.append({'location':'default', 'count': default_count})

        for a_file in current_files:
            card_details.append({'location':json_join(a_file)})
        write_json(current_directory, json_file_name, card_details)

    elif len(current_folders) > 0:
        for a_folder in current_folders:
            make_json_files(a_folder)

def convert_dilims(path):
    return path.replace(os.path.sep, '/')

def json_join(*paths):
    return convert_dilims(os.path.join(*paths))

def safe_delete(a_item, a_list):
    if a_item in a_list:
        a_list.remove(a_item)


make_json_files('.')
write_json(os.path.join('.', 'FashionCents'), master_json_file_name, directory_details)
