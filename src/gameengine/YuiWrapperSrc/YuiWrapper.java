package com.test;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

public class YuiWrapper {

	static Integer defaultIds = 10000;
	/**
	 * @param args
	 * @throws IOException 
	 */
	public static void main(String[] args) throws IOException {
		List<String> parameters = new ArrayList<String>();
		
		final Map<String,Integer> orderMap = new HashMap<String, Integer>();
		boolean orderParam = false;
		for(String s:args){
			if (orderParam){
				String[] splitted = s.split(",");
				for(int i = 0; i< splitted.length;i++){
					orderMap.put(splitted[i],i);
				}
				orderParam = false;
			}else if (!s.equals("--order")){
				parameters.add(s);
			}
			if (s.equals("--order")){
				orderParam = true;
			}
		}
		
		args = parameters.toArray(new String[]{});
		
		
		new File("min.js").delete();
		List<File> fileList = getRecursiveJSFiles(new File(System.getProperty("user.dir")));
		
		Set<File> fileOrdered = new TreeSet<File>(new Comparator<File>() {

			@Override
			public int compare(File o1, File o2) {
				Integer i1 = defaultIds++;
				Integer i2 = defaultIds++;
				String o1Name = o1.getName().replace(".js", "");
				String o2Name = o2.getName().replace(".js", "");
				if (orderMap.containsKey(o1Name)){
					i1 = orderMap.get(o1Name);
				}
				if (orderMap.containsKey(o2Name)){
					i2 = orderMap.get(o2Name);
				}
				
				return i1.compareTo(i2);
			}
		});
		
		fileOrdered.addAll(fileList);
		
		StringBuilder mainScript = new StringBuilder();
		for (File file : fileOrdered) {
			try {
				mainScript.append(readFile(file));
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		
		try {
			writeFile(mainScript.toString(), "temp.js");
		} catch (Exception e) {
			e.printStackTrace();
		}
		String command = "java -jar yuicompressor-2.4.8pre.jar temp.js ";
		for(String arg : args){
			boolean quoteIt = arg.startsWith("-") ? false : true;
			
			if (quoteIt){
				command += "\""+arg+"\" ";
			}else{
				command += arg+" ";
			}
		}
		System.err.println(command);
		Process process = Runtime.getRuntime().exec(command);
		try {
			System.err.println(readStream(process.getErrorStream()));
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		try {
			process.waitFor();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		new File("temp.js").delete();

	}
	
	public static List<File> getRecursiveJSFiles(File f){
		List<File> retList  = new ArrayList<File>();
		for(File file :f.listFiles()){
			if (file.isDirectory() && !file.getName().contains("test")){
				retList.addAll(getRecursiveJSFiles(file));
			}else if(file.getName().endsWith("js")){
				retList.add(file);
			}
		}
		
		return retList;
	}
	
	public static void writeFile(String s,String path) throws Exception{
		
		PrintWriter pw = new PrintWriter(path);
		pw.write(s);
		pw.flush();
		pw.close();
	}
	
	public static String readStream(InputStream reader) throws Exception{
		StringBuilder builder = new StringBuilder();
		int available = reader.available();
		
		while(available != 0){
			byte[] byteBuffer = new byte[available];
			reader.read(byteBuffer);
			builder.append(new String(byteBuffer));
						
			available = reader.available();
		}
		
		reader.close();
		
		return builder.toString();
	}
	
	public static String readFile(File f) throws Exception{
		
		InputStream reader = new FileInputStream(f);
		return readStream(reader);
	}

}
