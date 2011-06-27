require "yui/compressor"

ROOT = File.dirname(__FILE__)

def project_file(path)
  File.join(ROOT, path)
end

task :build do
  @compressor = YUI::JavaScriptCompressor.new(:munge => true)
  
  File.open(project_file("build/jquery.uploader.min.js"), 'w') do |f|
    f.puts @compressor.compress(File.open(project_file("src/front-end/jquery.uploader.js")))
  end
end

task :test do
  # for now, just open qunit in browser
end